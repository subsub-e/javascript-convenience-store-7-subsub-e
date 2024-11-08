import fs from "fs";
import { DateTimes } from "@woowacourse/mission-utils";
import { formatDate } from "../utils/formatting.js";

class Promotion {
  #promotionProductInfo;
  #todayDate;

  constructor() {
    this.#todayDate = formatDate(DateTimes.now());
    const fileData = fs.readFileSync("./public/promotions.md", "utf-8");
    this.#promotionProductInfo = this.#checkValidPromotion(
      this.#parseFileData(fileData)
    );
  }

  getPromotionInfo() {
    return this.#promotionProductInfo;
  }

  #parseFileData(fileData) {
    const eachData = fileData.trim().split("\n");
    const parseData = eachData.slice(1).map((data) => {
      const [name, buy, get, startDate, endDate] = data.split(",");
      return {
        name,
        buy: Number(buy),
        get: Number(get),
        startDate,
        endDate,
      };
    });
    return parseData;
  }

  #checkValidPromotion(parseData) {
    return parseData.filter((promotion) => {
      const todayDate = new Date(this.#todayDate);
      const startDate = new Date(promotion.startDate);
      const endDate = new Date(promotion.endDate);

      return todayDate >= startDate && todayDate <= endDate;
    });
  }
}

export default Promotion;
