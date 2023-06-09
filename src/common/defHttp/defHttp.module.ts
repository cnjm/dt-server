import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DefHttpService } from "./defHttp.service";

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [DefHttpService],
  exports: [DefHttpService],
})
export class DefHttpModule {
  //
}
