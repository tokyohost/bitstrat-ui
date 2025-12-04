import { ref } from 'vue';
import { checkPayStatus } from '@/layout/components/Recharge/pay';
import { QrPayCallBack } from '@/layout/components/Recharge/types';

export function usePaymentPolling() {
  const pollingTimer = ref(null);
  const pollingCount = ref(0);

  /**
   * 开始轮询支付状态
   * @param orderNo 商户订单号
   * @param onSuccess 成功回调
   * @param onFail 失败回调
   * @param intervalMs 轮询间隔
   * @param maxTimes 最大轮询次数
   */
  const startPolling = (orderNo: string | number, onSuccess: Function, onFail?: Function, intervalMs = 3000, maxTimes = 200) => {
    if (!orderNo) {
      console.error('orderNo 不能为空');
      return;
    }

    // 清理旧轮询
    stopPolling();
    pollingCount.value = 0;

    pollingTimer.value = setInterval(async () => {
      pollingCount.value++;

      try {
        const res = await checkPayStatus({ outTradeNo: orderNo });
        const code = res?.code;
        const data = res?.data;

        if (data.tradeStatus === 'SUCCESS' || data.tradeStatus === 'TRADE_SUCCESS') {
          stopPolling();
          onSuccess();
          return;
        }
        if (data.tradeStatus === 'FAILED') {
          stopPolling();
          onFail && onFail();
          return;
        }
      } catch (err) {
        console.error('支付状态请求失败', err);
      }

      // 超时处理
      if (pollingCount.value >= maxTimes) {
        console.log('轮询超时');
        stopPolling();
        onFail && onFail();
      }
    }, intervalMs);
  };

  /** 停止轮询 */
  const stopPolling = () => {
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value);
      pollingTimer.value = null;
    }
  };

  return {
    startPolling,
    stopPolling,
    pollingCount
  };
}
