import fs from "fs";
import ERROR_MESSAGES from "../constants/errorConstants.js";

class Stock {
  #productInfo;

  constructor() {
    const fileData = fs.readFileSync("./public/products.md", "utf-8");
    this.#productInfo = this.#parseFileData(fileData);
  }

  getProductInfo() {
    return this.#productInfo;
  }

  checkPurchaseInfo(purchaseInfo) {
    const missingProducts = Object.keys(purchaseInfo).filter((productName) => {
      return !this.#findProductInStock(productName);
    });

    if (missingProducts.length > 0) {
        throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
  }

  checkOutOfStock(purchaseInfo) {
    const outOfStockProducts = Object.keys(purchaseInfo).filter((productName) => {
      const product = this.#findProductInStock(productName);
      return product && purchaseInfo[productName] > product.quantity;
    });

    if (outOfStockProducts.length > 0) {
        throw new Error(ERROR_MESSAGES.OUT_OF_STOCK_LIMIT);
    }
  }

  #findProductInStock(name) {
    return this.#productInfo.find((product) => product.name === name);
  }

  #parseFileData(fileData) {
    const eachData = fileData.trim().split("\n");
    const parseData = eachData.slice(1).map((data) => {
      const [name, price, quantity, promotion] = data.split(",");
      return {
        name,
        price: Number(price),
        quantity: Number(quantity),
        promotion,
      };
    });
    return parseData;
  }
}

export default Stock;
