import { Injectable } from "@nestjs/common";

@Injectable()
export class GameUtils {
  constructor() {
    console.log("hh");
  }

  // 生成牌堆
  async createDeck() {
    // 三十张杀
    const killArr = new Array(30).fill({ text: "杀", type: "kill" });
    // 十五张闪
    const dodgeArr = new Array(15).fill({ text: "闪", type: "dodge" });
    return this.shuffle([...killArr, ...dodgeArr]);
  }

  // 洗牌
  async shuffle(array) {
    const res = [];
    let random = 0;
    while (array.length > 0) {
      random = Math.floor(Math.random() * array.length);
      res.push(array[random]);
      array.splice(random, 1);
    }
    return res;
  }
}
