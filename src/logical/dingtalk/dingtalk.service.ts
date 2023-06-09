import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as CryptoJS from "crypto-js";
import { Repository } from "typeorm";
import { DefHttpService } from "../../common/defHttp/defHttp.service";
import { RedisCacheService } from "/@/common/redis/redisCache.service";
import { DdUser } from "/@/entities/DdUser.entity";

@Injectable()
export class DingtalkService {
  constructor(
    @InjectRepository(DdUser)
    private ddUserRepository: Repository<DdUser>,
    private defHttpService: DefHttpService,
    private configService: ConfigService,
    private redisCacheService: RedisCacheService,
  ) {}

  /**
   * 获取token
   * @param params 字段
   */
  async getToken(): Promise<any | undefined> {
    const dingtalkConfig = this.configService.get("dingtalk");
    const key = `dingtalk:${dingtalkConfig.appKey}`;
    const redisValue = await this.redisCacheService.get(key);
    if (redisValue) {
      return redisValue;
    }
    const { access_token } = await this.defHttpService.get(
      `https://oapi.dingtalk.com/gettoken?appkey=${dingtalkConfig.appKey}&appsecret=${dingtalkConfig.appSecret}`,
    );
    this.redisCacheService.set(key, access_token, 2 * 59 * 60);
    return access_token;
  }
  /**
   * 获取jsapi鉴权ticket
   * @param access_token
   */
  async getJsApiTicket(access_token: string): Promise<any> {
    const { ticket } = await this.defHttpService.get(
      `https://oapi.dingtalk.com/get_jsapi_ticket?access_token=${access_token}`,
    );
    return ticket;
  }
  /**
   * 生成签名串
   * @param ticket
   * @param timeStamp
   * @param url
   * @param nonce
   * @returns 签名串
   */
  getJsApiSingNature(ticket, timeStamp, url, nonce = "jsapi") {
    const plainTex =
      "jsapi_ticket=" +
      ticket +
      "&noncestr=" +
      nonce +
      "&timestamp=" +
      timeStamp +
      "&url=" +
      url;
    const signature = CryptoJS.SHA1(plainTex).toString();
    return signature;
  }
  /**
   * dingtalk请求
   * @param params 字段
   */
  async getConfigData(url: string): Promise<any | undefined> {
    const { agentId } = this.configService.get("dingtalk");
    const access_token = await this.getToken();
    const ticket = await this.getJsApiTicket(access_token);
    const timeStamp = +new Date();
    const nonceStr = "jsapi";
    const signature = this.getJsApiSingNature(
      ticket,
      timeStamp,
      decodeURIComponent(url),
      nonceStr,
    );
    return {
      timeStamp,
      nonceStr,
      signature,
      appId: agentId,
    };
  }
  /**
   * 查询该userId用户
   * @param params 字段
   */
  async findOneByOpenId(userId: string): Promise<any | undefined> {
    let qb = this.ddUserRepository.createQueryBuilder("user");
    qb = qb.where("user.userId = :userId", { userId });
    const data = await qb.getOne();
    return data;
  }
  /**
   * 获取用户信息
   * @param params 字段
   */
  async getUserInfo(requestAuthCode: string): Promise<any | undefined> {
    // 不挂状态，先跟着socket
    const access_token = await this.getToken();
    const { userid: userId, name } = await this.defHttpService.get(
      `https://oapi.dingtalk.com/user/getuserinfo?access_token=${access_token}&code=${requestAuthCode}`,
    );

    const user = await this.findOneByOpenId(userId);
    if (user) {
      // console.log(user);
      return user;
    }

    const { result } = await this.defHttpService.post(
      `https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${access_token}`,
      { userid: userId },
      {
        headers: {
          "x-acs-dingtalk-access-token": access_token,
        },
      },
    );

    const entity = this.ddUserRepository.create({
      userId,
      name,
      avatar: result.avatar,
    });

    const data = await this.ddUserRepository.save(entity);

    return data;
  }
  /**
   * 更新用户信息
   * @param params 字段
   */
  async updateUserInfo(
    userInfo: any,
    socketId: string,
  ): Promise<any | undefined> {
    await this.ddUserRepository.update(userInfo.id, { socketId });
    await this.findOneByOpenId(userInfo.userId);
    return "ok";
  }
  /**
   * 获取群员所有用户信息
   * @param params 字段
   */
  async getGroupsUserList(params: any): Promise<any | undefined> {
    const dingtalkConfig = this.configService.get("dingtalk");
    const access_token = await this.getToken();
    try {
      const { memberUserIds } = await this.defHttpService.post(
        `https://api.dingtalk.com/v1.0/im/sceneGroups/members/batchQuery`,
        { ...params, coolAppCode: dingtalkConfig.coolAppCode, maxResults: 100 },
        {
          headers: {
            "x-acs-dingtalk-access-token": access_token,
          },
        },
      );
      for (let i = 0; i < memberUserIds.length; i++) {
        const userId = memberUserIds[i];
        const user = await this.findOneByOpenId(userId);
        if (!user) {
          const { result } = await this.defHttpService.get(
            `https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${access_token}&userid=${userId}`,
          );
          const entity = this.ddUserRepository.create({
            userId,
            name: result.name,
            avatar: result.avatar,
          });
          await this.ddUserRepository.save(entity);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return "ok";
  }
  /**
   * 获取群员所有用户信息
   * @param params 字段
   */
  async getUserList(): Promise<any | undefined> {
    let qb = this.ddUserRepository.createQueryBuilder("user");
    qb = qb.orderBy("user.update_at", "DESC");
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
  /**
   * 发送普通消息
   * @param params 字段
   */
  async sendGroupMessages(params: any): Promise<any | undefined> {
    console.log(params);
    const access_token = await this.getToken();
    const { coolAppCode, robotCode, openConversationId } =
      this.configService.get("dingtalk");
    const body = {
      msgParam: JSON.stringify({
        content: params.message,
      }),
      msgKey: "sampleText",
      openConversationId,
      robotCode: robotCode,
      coolAppCode: coolAppCode,
    };
    const result = await this.defHttpService.post(
      `https://api.dingtalk.com/v1.0/robot/groupMessages/send`,
      body,
      {
        headers: {
          "x-acs-dingtalk-access-token": access_token,
        },
      },
    );
    console.log(result);
    return "ok";
  }
  /**
   * 创建对局
   * @param params 字段
   */
  async createMatch(): Promise<any | undefined> {
    return "ok";
  }
}
