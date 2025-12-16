<script setup lang="ts" name="compareLinerChart">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getToken } from '@/utils/auth';
import PriceDiffBar from '@/views/system/analysis/components/PriceDiffBar.vue';
import { WebsocketMsgData, WebsocketMsgDataAi } from '@/views/components/type/type';
import { getEnv } from '@/env';

const props = defineProps<{
  businessType?: string;
  exchangeA: string;
  symbolA: string;
  typeA: string;
  exchangeB: string;
  symbolB: string;
  typeB: string;
}>();

const { API_WS_SERVER } = getEnv();
const API_SERVER = API_WS_SERVER || 'ws://localhost:7400';
const token = getToken();

const priceMap = new Map<string, number>(); // 存最近一次每个交易所的价格
const chartContainer = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let socket: ReconnectingWebSocket | null = null;
let resizeObserver: ResizeObserver | null = null;

// 每 5 秒发送一次 ping 消息
const HEARTBEAT_INTERVAL = 5 * 1000;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
const loading = ref<boolean>(true);

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
      animation: false,
      title: { text: titleText.value },
      tooltip: { trigger: 'axis' },
      legend: {
        data: [props.exchangeA.toLowerCase(), props.exchangeB.toLowerCase()],
        top: 'top',
        left: 'right',
        textStyle: {
          fontSize: 12
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
          smooth: true,
          lineStyle: {
            color: '#5470C6' // 设置线条颜色（蓝色）
          }
        },
        {
          name: props.exchangeB,
          type: 'line',
          data: dataB,
          showSymbol: false,
          connectNulls: true,
          smooth: true,
          lineStyle: {
            color: '#91CC75' // 设置线条颜色（绿色）
          }
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
  titleText.value = `{a|${props.exchangeA}[${props.symbolA}][A] $${lastA}}\n{b|${props.exchangeB}[${props.symbolB}][B] $${lastB}}`;

  chartInstance?.setOption(
    {
      animation: false,
      title: {
        text: titleText.value,
        textStyle: {
          rich: {
            a: {
              // fontWeight: 'bold',
              fontSize: 14,
              color: '#5470C6',
              lineHeight: 24,
              align: 'right'
            },
            b: {
              color: '#91CC75',
              fontSize: 14,
              lineHeight: 24,
              align: 'right',
              width: 200
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
              color: '#5470C6'
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
              formatter: `${lastB} `,
              fontSize: 12,
              color: '#5470C6'
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
    },
    { notMerge: false, lazyUpdate: true }
  );
  // resizeObserver = new ResizeObserver(() => {
  //   chartInstance?.resize();
  // });
  // resizeObserver.observe(chartContainer.value);
};

const spreadAminusB = ref(0);
const spreadBminusA = ref(0);
const priceA = ref(0);
const priceB = ref(0);
const priceDiff5Min = ref<PriceDiff>({
  max: 0,
  min: 0
});
const priceDiff10Min = ref<PriceDiff>({
  max: 0,
  min: 0
});
const priceDiff20Min = ref<PriceDiff>({
  max: 0,
  min: 0
});
const priceDiff30Min = ref<PriceDiff>({
  max: 0,
  min: 0
});
onMounted(() => {
  try {
    initChart();
  } catch (e) {
    loading.value = false;
    return;
  }
  const wsUrl = buildWsUrl();
  socket = new ReconnectingWebSocket(wsUrl);

  socket.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data) as WebsocketMsgDataAi;
      if (msg.type == 'marketPrice') {
        // console.log(msg);
        const { price, exchange, serverTimestamp } = msg.data;
        if (!price || !exchange || !serverTimestamp) return;

        priceMap.set(exchange, price);

        priceA.value = priceMap.get(props.exchangeA.toLowerCase());
        priceB.value = priceMap.get(props.exchangeB.toLowerCase());

        if (priceA.value !== undefined && priceB.value !== undefined) {
          spreadAminusB.value = +(priceA.value - priceB.value).toFixed(8);
          spreadBminusA.value = +(priceB.value - priceA.value).toFixed(8);

          // console.log(`A-B: ${spreadAminusB.value}, B-A: ${spreadBminusA.value}`);

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
      }

      if (msg.type == 'marketPriceAnalysis') {
        //采样统计
        const data = msg.data;
        const data5 = data[0];
        priceDiff5Min.value.max = data5[0];
        priceDiff5Min.value.min = data5[1];
        const data10 = data[1];
        priceDiff10Min.value.max = data10[0];
        priceDiff10Min.value.min = data10[1];
        const data20 = data[2];
        priceDiff20Min.value.max = data20[0];
        priceDiff20Min.value.min = data20[1];
        const data30 = data[3];
        priceDiff30Min.value.max = data30[0];
        priceDiff30Min.value.min = data30[1];
      }
    } catch (e) {
      console.warn('WebSocket 数据格式错误：', event.data);
    }
  });
  socket.addEventListener('open', () => {
    console.log('WebSocket 连接已打开');
    loading.value = false;
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

  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  resizeObserver.observe(chartContainer.value);
});
export interface PriceDiff {
  max: number;
  min: number;
}

onUnmounted(() => {
  resizeObserver?.disconnect();
  socket?.close();
  chartInstance?.dispose();
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  loading.value = true;
});
</script>

<template>
  <div class="flex flex-col gap-row-2">
    <div class="flex justify-between" style="width: 100%" v-loading="loading">
      <div ref="chartContainer" style="width: 100%; min-height: 400px; height: 100%"></div>
      <price-diff-bar :ab-diff="spreadAminusB" :ba-diff="spreadBminusA" :price-a="priceA" :price-b="priceB"></price-diff-bar>
    </div>
    <div class="flex flex-row justify-around">
      <div class="flex flex-row gap-2 justify-center">
        <div>+A -B</div>
        <div class="flex flex-row gap-4 justify-center text-xs">
          <div class="flex flex-col gap-col-1 justify-start">
            <div>5min 价差</div>
            <div>
              MAX <span class="color-red">{{ -priceDiff5Min.min }}%</span>
            </div>
            <div>
              MIN <span class="color-green-7">{{ -priceDiff5Min.max }}%</span>
            </div>
          </div>
          <!--          <div class="flex flex-col gap-col-1 justify-start">-->
          <!--            <div>10min 价差</div>-->
          <!--            <div>-->
          <!--              MAX <span class="color-red">{{ -priceDiff10Min.max }}%</span>-->
          <!--            </div>-->
          <!--            <div>-->
          <!--              MIN <span class="color-green-7">{{ -priceDiff10Min.min }}%</span>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--          <div class="flex flex-col gap-col-1 justify-start">-->
          <!--            <div>20min 价差</div>-->
          <!--            <div>-->
          <!--              MAX <span class="color-red">{{ -priceDiff20Min.max }}%</span>-->
          <!--            </div>-->
          <!--            <div>-->
          <!--              MIN <span class="color-green-7">{{ -priceDiff20Min.min }}%</span>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--          <div class="flex flex-col gap-col-1 justify-start">-->
          <!--            <div>30min 价差</div>-->
          <!--            <div>-->
          <!--              MAX <span class="color-red">{{ -priceDiff30Min.max }}%</span>-->
          <!--            </div>-->
          <!--            <div>-->
          <!--              MIN <span class="color-green-7">{{ -priceDiff30Min.min }}%</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="flex flex-row gap-2 justify-center">
        <div>+B -A</div>
        <div class="flex flex-row gap-4 justify-center text-xs">
          <div class="flex flex-col gap-col-1 justify-start">
            <div>5min 价差</div>
            <div>
              MAX <span class="color-green-7">{{ priceDiff5Min.max }}%</span>
            </div>
            <div>
              MIN <span class="color-red">{{ priceDiff5Min.min }}%</span>
            </div>
          </div>
          <!--          <div class="flex flex-col gap-col-1 justify-start">-->
          <!--            <div>10min 价差</div>-->
          <!--            <div>-->
          <!--              MAX <span class="color-green-7">{{priceDiff10Min.min }}%</span>-->
          <!--            </div>-->
          <!--            <div>-->
          <!--              MIN <span class="color-red">{{ priceDiff10Min.max }}%</span>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--          <div class="flex flex-col gap-col-1 justify-start">-->
          <!--            <div>20min 价差</div>-->
          <!--            <div>-->
          <!--              MAX <span class="color-green-7">{{ priceDiff20Min.min }}%</span>-->
          <!--            </div>-->
          <!--            <div>-->
          <!--              MIN <span class="color-red">{{ priceDiff20Min.max }}%</span>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--          <div class="flex flex-col gap-col-1 justify-start">-->
          <!--            <div>30min 价差</div>-->
          <!--            <div>-->
          <!--              MAX <span class="color-green-7">{{ priceDiff30Min.min }}%</span>-->
          <!--            </div>-->
          <!--            <div>-->
          <!--              MIN <span class="color-red">{{ priceDiff30Min.max }}%</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
