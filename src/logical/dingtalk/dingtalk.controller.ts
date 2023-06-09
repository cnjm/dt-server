import { Body, Controller, Post } from "@nestjs/common";
import { DingtalkService } from "./dingtalk.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("dingtalk")
@Controller("dingtalk")
export class DingtalkController {
  constructor(private readonly dingtalkService: DingtalkService) {}

  @Post("getConfigData")
  @ApiOperation({ summary: "获取鉴权信息" })
  async getConfigData(@Body() params: any) {
    return this.dingtalkService.getConfigData(params.url);
  }

  @Post("getUserInfo")
  @ApiOperation({ summary: "获取用户信息" })
  async getUserInfo(@Body() params: any) {
    return this.dingtalkService.getUserInfo(params.requestAuthCode);
  }

  @Post("getGroupsUserList")
  @ApiOperation({ summary: "获取群成员用户信息" })
  async getGroupsUserList(@Body() params: any) {
    return this.dingtalkService.getGroupsUserList(params);
  }

  @Post("getUserList")
  @ApiOperation({ summary: "获取所有群成员" })
  async getUserList() {
    return this.dingtalkService.getUserList();
  }

  @Post("sendGroupMessages")
  @ApiOperation({ summary: "发送普通群聊消息" })
  async sendGroupMessages(@Body() params: any) {
    return this.dingtalkService.sendGroupMessages(params);
  }

  @Post("createMatch")
  @ApiOperation({ summary: "创建对局" })
  async createMatch() {
    return this.dingtalkService.createMatch();
  }

  @Post("receiveMessage")
  @ApiOperation({ summary: "接收消息" })
  async receiveMessage(@Body() params: any) {
    console.log(params);
    await this.dingtalkService.sendGroupMessages({
      message: params.senderNick + ":" + params.text.content,
    });
    return "hh";
    // return this.dingtalkService.receiveMessage();
  }
}
