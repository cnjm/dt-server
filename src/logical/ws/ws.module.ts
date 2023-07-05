import { Module } from "@nestjs/common";
import { DingtalkModule } from "../dingtalk/dingtalk.module";
import { DingtalkService } from "../dingtalk/dingtalk.service";
import { GameUtils } from "./gameUtils";
import { DdWebSocketGateway } from "./ws.gateway";

@Module({
  imports: [DingtalkModule],
  providers: [DdWebSocketGateway, GameUtils],
})
export class DdWebSocketModule {}
