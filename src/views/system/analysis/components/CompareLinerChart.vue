<script setup lang="ts" name="compareLinerChart">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getToken } from '@/utils/auth';
import PriceDiffBar from '@/views/system/analysis/components/PriceDiffBar.vue';

const props = defineProps<{
  businessType?: string;
  exchangeA: string;
  symbolA: string;
  typeA: string;
  exchangeB: string;
  symbolB: string;
  typeB: string;
}>();

const API_SERVER = import.meta.env.VITE_API_SERVER || 'ws://localhost:7400';
const token = getToken();

const priceMap = new Map<string, number>(); // 存最近一次每个交易所的价格
const chartContainer = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let socket: ReconnectingWebSocket | null = null;
let resizeObserver: ResizeObserver | null = null;

// 每 5 秒发送一次 ping 消息
const HEARTBEAT_INTERVAL = 5 * 1000;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

const timestamps: string[] = [];
const dataA: number[] = [];
const dataB: number[] = [];

// 组装 WebSocket URL
const buildWsUrl = () => {
  return (
    `${API_SERVER}/mc?token=${token}&businessType=${props.businessType ?? 'compare'}` +
    `&exchange1=${props.exchangeA}&symbol1=${props.symbolA}&type1=${props.typeA}` +
    `&exchange2=${props.exchangeB}&symbol2=${props.symbolB}&type2=${props.typeB}`
  );
};
const titleText = ref('');
// 初始化 ECharts
const initChart = () => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value);
    chartInstance.setOption({
      title: { text: titleText.value },
      tooltip: { trigger: 'axis' },
      legend: {
        data: [props.exchangeA.toLowerCase(), props.exchangeB.toLowerCase()],
        top: 'top',
        left: 'left',
        textStyle: {
          fontSize: 14
        }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: timestamps
      },
      yAxis: {
        type: 'value',
        scale: true,
        min: (value) => value.min - 0.00002, // 向下扩展一点
        max: (value) => value.max + 0.00002 // 向上扩展一点
      },
      series: [
        {
          name: props.exchangeA,
          type: 'line',
          data: dataA,
          showSymbol: false,
          connectNulls: true,
          smooth: true
        },
        {
          name: props.exchangeB,
          type: 'line',
          data: dataB,
          showSymbol: false,
          connectNulls: true,
          smooth: true
        }
      ]
    });
  }
};

// 更新数据到图表
const updateChart = () => {
  const lastIndex = dataA.length - 1;
  const lastA = dataA[lastIndex];
  const lastB = dataB[lastIndex];
  titleText.value = `{a|${props.exchangeA} ${lastA}}\n{b|${props.exchangeB} ${lastB}}`;

  chartInstance?.setOption({
    title: {
      text: titleText.value,
      textStyle: {
        rich: {
          a: {
            fontWeight: 'bold',
            fontSize: 16,
            color: '#E6A23C',
            lineHeight: 24
          },
          b: {
            color: '#F56C6C',
            fontSize: 16,
            lineHeight: 24
          }
        }
      }
    },
    xAxis: { data: timestamps },
    series: [
      {
        name: props.exchangeA,
        type: 'line',
        data: dataA,
        showSymbol: false,
        connectNulls: true,
        smooth: true,
        markPoint: {
          symbol: 'circle',
          symbolSize: 5,
          label: {
            show: true,
            formatter: `${lastA}`,
            fontSize: 12,
            color: '#F56C6C'
          },
          data: [
            {
              coord: [lastIndex, lastA],
              value: lastA
            }
          ],
          itemStyle: {
            color: '#67C23A'
          }
        }
      },
      {
        name: props.exchangeB,
        type: 'line',
        data: dataB,
        showSymbol: false,
        connectNulls: true,
        smooth: true,
        markPoint: {
          symbol: 'circle',
          symbolSize: 5,
          label: {
            show: true,
            formatter: `${lastB}`,
            fontSize: 12,
            color: '#F56C6C'
          },
          data: [
            {
              coord: [lastIndex, lastB],
              value: lastB
            }
          ],
          itemStyle: {
            color: '#67C23A'
          }
        }
      }
    ]
  });
  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  resizeObserver.observe(chartContainer.value);
};

const spreadAminusB = ref(0);
const spreadBminusA = ref(0);
const priceA = ref(0);
const priceB = ref(0);

onMounted(() => {
  initChart();
  const wsUrl = buildWsUrl();
  socket = new ReconnectingWebSocket(wsUrl);

  socket.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);
      // console.log(msg);
      const { price, exchange, serverTimestamp } = msg;
      if (!price || !exchange || !serverTimestamp) return;

      priceMap.set(exchange, price);

      priceA.value = priceMap.get(props.exchangeA.toLowerCase());
      priceB.value = priceMap.get(props.exchangeB.toLowerCase());

      if (priceA.value !== undefined && priceB.value !== undefined) {
        spreadAminusB.value = +(priceA.value - priceB.value).toFixed(8);
        spreadBminusA.value = +(priceB.value - priceA.value).toFixed(8);

        console.log(`A-B: ${spreadAminusB.value}, B-A: ${spreadBminusA.value}`);

        // 你可以选择：
        // 1. 渲染到图表上（新增一条 spread 折线）
        // 2. 更新 UI 展示：当前 A 比 B 高多少
      }

      const timeStr = new Date(serverTimestamp).toLocaleTimeString();
      timestamps.push(timeStr);

      // 对应的数据补上
      if (exchange === props.exchangeA.toLowerCase()) {
        dataA.push(price);
        dataB.push(dataB[dataB.length - 1] ?? null); // 上一值 或 null
      } else if (exchange === props.exchangeB.toLowerCase()) {
        dataB.push(price);
        dataA.push(dataA[dataA.length - 1] ?? null);
      } else {
        return; // 忽略其他来源
      }

      if (timestamps.length > 100) {
        timestamps.shift();
        dataA.shift();
        dataB.shift();
      }

      updateChart();
    } catch (e) {
      console.warn('WebSocket 数据格式错误：', event.data);
    }
  });
  socket.addEventListener('open', () => {
    console.log('WebSocket 连接已打开');

    // 启动心跳
    heartbeatTimer = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
        // 或直接发送字符串：ws.send('ping')
      }
    }, HEARTBEAT_INTERVAL);
  });
  socket.addEventListener('close', () => {
    console.log('WebSocket 连接已关闭');
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  });
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  socket?.close();
  chartInstance?.dispose();
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
});
</script>

<template>
  <div class="flex justify-between" style="width: 100%">
    <div ref="chartContainer" style="width: 100%; height: 400px"></div>
    <price-diff-bar :ab-diff="spreadAminusB" :ba-diff="spreadBminusA" :price-a="priceA" :price-b="priceB"></price-diff-bar>
  </div>
</template>

<style scoped></style>
