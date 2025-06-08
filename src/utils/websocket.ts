import { getToken } from '@/utils/auth';
import { ElNotification } from 'element-plus';
import { useNoticeStore } from '@/store/modules/notice';
import { emitter } from '@/utils/eventBus';
import { ABOrderData, CoinsAbOrderLog, PositionWsData, WebsocketMsgData } from '@/views/components/type/type';
import { WebsocketExStatus, WebsocketStatus } from '@/layout/components/NotifySetting/types';
import ReconnectingWebSocket from 'reconnecting-websocket';
// 初始化socket
export const initWebSocket = (url: any) => {
  initReconnectWebSocket(url)
  // if (import.meta.env.VITE_APP_WEBSOCKET === 'false') {
  //   return;
  // }
  // // url = url + '?Authorization=Bearer ' + getToken() + '&clientid=' + import.meta.env.VITE_APP_CLIENT_ID;
  // url = url + '?token=' + getToken() + '&clientid=' + import.meta.env.VITE_APP_CLIENT_ID;
  // useWebSocket(url, {
  //   autoReconnect: {
  //     // 重连最大次数
  //     retries: 99999,
  //     // 重连间隔
  //     delay: 1000,
  //     onFailed() {
  //       console.log('websocket重连失败');
  //     }
  //   },
  //   heartbeat: {
  //     message: JSON.stringify({ type: 'ping' }),
  //     // 发送心跳的间隔
  //     interval: 10000,
  //     // 接收到心跳response的超时时间
  //     pongTimeout: 6000
  //   },
  //   onConnected() {
  //     console.log('websocket已经连接');
  //   },
  //   onDisconnected() {
  //     console.log('websocket已经断开');
  //   },
  //   onMessage: (_, e) => {
  //     if (e.data.indexOf('ping') > 0) {
  //       return;
  //     }
  //     const data = JSON.parse(e.data);
  //     if (data.type) {
  //       if (data.type == 'order') {
  //         // 广播事件
  //         emitter.emit('orderMessage', data.data);
  //       }
  //       if (data.type == 'position') {
  //         // 广播事件
  //         // console.log(data.data);
  //         emitter.emit('positionMessage', data as WebsocketMsgData<PositionWsData[]>);
  //       }
  //       if (data.type == 'account') {
  //         // 广播事件
  //         // console.log(data.data);
  //         emitter.emit('accountMessage', data.data as WebsocketExStatus[]);
  //       }
  //       if (data.type == 'abTaskCallback') {
  //         // 广播事件
  //         // console.log(data.data);
  //         emitter.emit('abOrderMessage', data.data as ABOrderData[]);
  //       }
  //       return;
  //     }
  //
  //     useNoticeStore().addNotice({
  //       message: e.data,
  //       read: false,
  //       time: new Date().toLocaleString()
  //     });
  //     ElNotification({
  //       title: '消息',
  //       message: e.data,
  //       type: 'success',
  //       duration: 3000
  //     });
  //   }
  // });
};

// 初始化socket
export const initReconnectWebSocket = (url: any) => {
  if (import.meta.env.VITE_APP_WEBSOCKET === 'false') {
    return;
  }
  // 每 5 秒发送一次 ping 消息
  const HEARTBEAT_INTERVAL = 5 * 1000;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  let socket: ReconnectingWebSocket | null = null;
  // url = url + '?Authorization=Bearer ' + getToken() + '&clientid=' + import.meta.env.VITE_APP_CLIENT_ID;
  url = url + '?token=' + getToken() + '&clientid=' + import.meta.env.VITE_APP_CLIENT_ID;
  socket = new ReconnectingWebSocket(url);
  socket.addEventListener('message', (e) => {
    try {
      if (e.data.indexOf('ping') > 0) {
        return;
      }
      const data = JSON.parse(e.data);
      if (data.type) {
        if (data.type == 'order') {
          // 广播事件
          emitter.emit('orderMessage', data.data);
        }
        if (data.type == 'position') {
          // 广播事件
          // console.log(data.data);
          emitter.emit('positionMessage', data as WebsocketMsgData<PositionWsData[]>);
        }
        if (data.type == 'account') {
          // 广播事件
          // console.log(data.data);
          emitter.emit('accountMessage', data.data as WebsocketExStatus[]);
        }
        if (data.type == 'abTaskCallback') {
          // 广播事件
          // console.log(data.data);
          emitter.emit('abOrderMessage', data.data as ABOrderData[]);
        }
        if (data.type == 'abOrderLog') {
          // 广播事件
          // console.log(data.data);
          emitter.emit('abOrderLog', data.data as CoinsAbOrderLog);
        }
        return;
      }

      useNoticeStore().addNotice({
        message: e.data,
        read: false,
        time: new Date().toLocaleString()
      });
      ElNotification({
        title: '消息',
        message: e.data,
        type: 'success',
        duration: 3000
      });
    } catch (e) {
      console.log(e);
    }
  });
  socket.addEventListener('open', () => {
    console.log('init WebSocket is open!');
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
};
