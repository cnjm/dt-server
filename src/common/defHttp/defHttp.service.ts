import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class DefHttpService {
  constructor(private httpService: HttpService) {}

  get<T = any>(url: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      firstValueFrom(this.httpService.get(url))
        .then((res) => {
          if (res.status !== 200) {
            reject("网络错误");
            return;
          }
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      firstValueFrom(this.httpService.post(url, data, config))
        .then((res) => {
          if (res.status !== 200) {
            reject("网络错误");
            return;
          }
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
