import { Module } from "@nestjs/common";
import { DefHttpModule } from "/@/common/defHttp/defHttp.module";
import { DingtalkController } from "./dingtalk.controller";
import { DingtalkService } from "./dingtalk.service";
import { RedisCacheService } from "/@/common/redis/redisCache.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DdUser } from "/@/entities/DdUser.entity";

@Module({
  imports: [DefHttpModule, TypeOrmModule.forFeature([DdUser])],
  controllers: [DingtalkController],
  providers: [DingtalkService, RedisCacheService],
  exports: [DingtalkService],
})
export class DingtalkModule {
  //
}
