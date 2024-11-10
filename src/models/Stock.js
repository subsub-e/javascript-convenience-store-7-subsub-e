import fs from 'fs';
import ERROR_MESSAGES from '../constants/errorConstants.js';

class Stock {
  #productInfo;

  constructor() {
    const fileData = fs.readFileSync('./public/products.md', 'utf-8');
    this.#productInfo = this.#parseFileData(fileData);
  }

  getProductInfo() {
    return this.#productInfo;
  }

  getProductTotalPrice(productName, quantity) {
    const product = this.findProductsInStock(productName);
    return product[0].price * quantity;
  }

  checkPurchaseInfo(purchaseInfo) {
    const missingProducts = Object.keys(purchaseInfo).filter((productName) => {
      return this.findProductsInStock(productName).length === 0;
    });

    if (missingProducts.length > 0) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
  }

  checkOutOfStock(purchaseInfo) {
    const outOfStockProducts = Object.keys(purchaseInfo).filter(
      (productName) => {
        const products = this.findProductsInStock(productName);
        let totalQuantityAvailable = products.reduce(
          (sum, product) => sum + product.quantity,
          0
        );
        return purchaseInfo[productName] > totalQuantityAvailable;
      }
    );
    if (outOfStockProducts.length > 0) {
      throw new Error(ERROR_MESSAGES.OUT_OF_STOCK_LIMIT);
    }
  }

  findProductsInStock(name) {
    return this.#productInfo.filter((product) => product.name === name);
  }

  findProductSameNameAndPromotion(product) {
    return this.#productInfo.find(
      (item) =>
        item.name === product.name && item.promotion === product.promotion
    );
  }

  subtrackStock(product, quantity) {
    const productInStock = this.findProductSameNameAndPromotion(product);
    productInStock.quantity -= quantity;
  }

  additionalSubtrackStock(productName, quantity) {
    const productInStock = this.findProductSameNameAndPromotion({
      name: productName,
      promotion: 'null',
    });
    productInStock.quantity -= quantity;
  }

  #parseFileData(fileData) {
    const eachData = fileData.trim().split('\n');
    const parsedData = eachData.slice(1).map((data) => {
      const [name, price, quantity, promotion] = data.split(',');
      return {
        name,
        price: Number(price),
        quantity: Number(quantity),
        promotion,
      };
    });

    const productInfo = [];
    parsedData.forEach((product) =>
      this.#processProduct(product, productInfo, parsedData)
    );
    return productInfo;
  }

  #processProduct(product, productInfo, parsedData) {
    const { name, price, quantity, promotion } = product;

    if (promotion !== 'null') {
      productInfo.push({ name, price, quantity, promotion });
      const existingNonPromoProduct = this.#checkNonPromoProductExistence(
        name,
        parsedData
      );
      if (!existingNonPromoProduct) {
        productInfo.push({ name, price, quantity: 0, promotion: 'null' });
      }
    } else {
      productInfo.push({ name, price, quantity, promotion: 'null' });
    }
  }

  #checkNonPromoProductExistence(name, parsedData) {
    return parsedData.find(
      (item) => item.name === name && item.promotion === 'null'
    );
  }
}

export default Stock;
