import { io } from "socket.io-client";

// WebSocket 配置
const socket = {
  websock: null as WebSocket | null, // WebSocket 实例
  ws_url: "wss://www.nextstepcode.club/ws", // WebSocket 服务器地址
  socket_open: false, // 是否连接成功 
  hearbeat_timer: null as any,  // 心跳定时器
  hearbeat_interval: 5000,  // 心跳间隔时间
  is_reonnect: true,  // 是否允许重连
  reconnect_count: 3, // 重连次数
  reconnect_current: 1, // 当前重连次数
  reconnect_timer: null as any, // 重连定时器
  reconnect_interval: 3000, // 重连间隔时间

  /**
   * 初始化 WebSocket 连接
   */
  init() {
    if (!("WebSocket" in window)) {
      console.error("当前浏览器不支持 WebSocket");
      return;
    }

    if (this.websock) {
      return;
    }

    this.websock = new WebSocket(this.ws_url);

    this.websock.onopen = () => {
      console.log("WebSocket 连接成功");
      this.socket_open = true;
      this.is_reonnect = true;
      this.heartbeat();
    };

    this.websock.onmessage = (e) => {
      this.receive(e);
    };

    this.websock.onclose = (e) => {
      console.log("WebSocket 连接断开", e.code);
      clearInterval(this.hearbeat_timer);
      this.socket_open = false;
      if (this.is_reonnect) {
        this.reconnect();
      }
    };

    this.websock.onerror = (e) => {
      console.error("WebSocket 连接发生错误", e);
    };
  },

  /**
   * 发送消息
   */
  send(data: any, callback?: () => void) {
    if (this.websock && this.websock.readyState === WebSocket.OPEN) {
      this.websock.send(JSON.stringify(data));
      if (callback) callback();
    } else {
      console.warn("WebSocket 未连接，尝试重连...");
      this.init();
      setTimeout(() => this.send(data, callback), 1000);
    }
  },

  /**
   * 接收消息
   */
  receive(message: MessageEvent) {
    try {
      const data = JSON.parse(message.data);
      console.log("收到服务器消息：", data);
    } catch (error) {
      console.error("消息解析错误", error);
    }
  },

  /**
   * 发送心跳包
   */
  heartbeat() {
    console.log("WebSocket 发送心跳包");
    clearInterval(this.hearbeat_timer);
    this.hearbeat_timer = setInterval(() => {
      const token = localStorage.getItem("Access-Token");
      const data = { kind: 0, token };
      this.send(data);
    }, this.hearbeat_interval);
  },

  /**
   * 断开 WebSocket 连接
   */
  close() {
    console.log("主动关闭 WebSocket 连接");
    this.is_reonnect = false;
    clearInterval(this.hearbeat_timer);
    this.websock?.close();
  },

  /**
   * 重新连接
   */
  reconnect() {
    console.log(`WebSocket 尝试重连 (${this.reconnect_current}/${this.reconnect_count})`);
    if (this.reconnect_current > this.reconnect_count) {
      console.warn("WebSocket 重连失败");
      return;
    }
    this.reconnect_current++;
    setTimeout(() => this.init(), this.reconnect_interval);
  }
};

export { socket };
