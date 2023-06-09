import { Module } from "@nestjs/common";
import { DingtalkModule } from "../dingtalk/dingtalk.module";
import { DingtalkService } from "../dingtalk/dingtalk.service";
import { DdWebSocketGateway } from "./ws.gateway";

@Module({
  imports: [DingtalkModule],
  providers: [DdWebSocketGateway],
})
export class DdWebSocketModule {}
