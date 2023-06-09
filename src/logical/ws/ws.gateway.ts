import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { DingtalkService } from "../dingtalk/dingtalk.service";
@WebSocketGateway(4000, {
  cors: true,
  namespace: "dingtalk",
})
/**
 * 1. 通信链接
 * 2. 加入房间
 * 3. 广播成员信息
 * 4. 广播&接收对局信息  (创建房间、加入房间、开始游戏等)
 */
export class DdWebSocketGateway {
  constructor(private readonly dingtalkService: DingtalkService) {
    this.defaultRoom = "三国杀";
    this.roomInfo = {
      status: 0,
      // 活跃状态人群
      activeUserList: [],
      // 房间成员列表
      roomUserList: [],
    };
  }

  @WebSocketServer()
  server: any;

  // 房间名称
  defaultRoom: string;

  // 房间信息
  roomInfo: any;

  afterInit() {
    console.log("服务端初始化完成-----");
  }
  // 客户端连接
  async handleConnection(socket: Socket): Promise<void> {
    //新的连接
    await socket.join(this.defaultRoom);
  }
  async handleDisconnect(socket: Socket): Promise<void> {
    const index = this.roomInfo.roomUserList.findIndex(
      (item) => item.socketId === socket.id,
    );
    if (index >= 0) {
      this.roomInfo.roomUserList[index].action = false;
    }
  }

  // 接收客户端信息
  @SubscribeMessage("receive")
  async handleReceiveEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() params: any,
  ) {
    await this[params.event](socket, params);
  }

  // 向特定人群发送信息
  async emitEvent({ event, message, data }) {
    this.server.to(this.defaultRoom).emit(event, {
      message,
      data,
    });
  }

  // 推送房间信息
  async sendRoomInfo() {
    // this.getActiveUserList();
    this.emitEvent({
      event: "roomInfo",
      message: "房间信息",
      data: this.roomInfo,
    });
  }

  // 活跃人数信息
  // async getActiveUserList() {
  //   const room = this.server.adapter.rooms.get(this.defaultRoom);
  //   const socketIdList = Array.from(new Set(room));
  //   this.roomInfo.activeUserList = socketIdList;
  // }

  // 更新状态
  async updateInfo(socket: Socket, params: any) {
    const index = this.roomInfo.roomUserList.findIndex(
      (item) => item.userId === params.userInfo.userId,
    );
    if (index >= 0) {
      this.roomInfo.roomUserList[index].socketId = socket.id;
      this.roomInfo.roomUserList[index].action = true;
      await this.sendRoomInfo();
    }
  }

  // 进入房间
  async joinEvent(socket: Socket, params: any) {
    const index = this.roomInfo.roomUserList.findIndex(
      (item) => item.userId === params.userInfo.userId,
    );
    if (index < 0) {
      this.roomInfo.roomUserList.push({
        ...params.userInfo,
        socketId: socket.id,
        action: true,
      });
      // 欢迎加入
      this.emitEvent({
        event: "joinRoomUser",
        message: "新加入人员",
        data: params.userInfo,
      });
      this.sendRoomInfo();
    }
    // this.getActiveUserList();
  }

  // 开始游戏
  async startMatchEvent(socket: Socket) {
    this.dingtalkService.sendGroupMessages({ message: "" });
  }
  // 推送加入对局的人员
  async sendJoinMatchList() {
    // const { items } = await this.dingtalkService.getUserList();
    // const joinUserList = items.filter((item) => {
    //   return this.joinUserList.includes(item.socketId);
    // });
    // this.server.to(this.defaultRoom).emit("joinUserList", {
    //   msg: "joinUserList",
    //   data: { joinUserList },
    // });
  }
}
