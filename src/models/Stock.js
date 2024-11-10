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
    const outOfStockProducts = this.#findOutOfStockProducts(purchaseInfo);
    if (outOfStockProducts.length > 0) {
      throw new Error(ERROR_MESSAGES.OUT_OF_STOCK_LIMIT);
    }
  }

  #findOutOfStockProducts(purchaseInfo) {
    return Object.keys(purchaseInfo).filter((productName) => {
      const totalQuantityAvailable = this.#calculateTotalQuantity(productName);
      return purchaseInfo[productName] > totalQuantityAvailable;
    });
  }

  #calculateTotalQuantity(productName) {
    const products = this.findProductsInStock(productName);
    return products.reduce((sum, product) => sum + product.quantity, 0);
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
    const parsedData = this.#parseRawData(fileData);
    return this.#reinforceProductInfo(parsedData);
  }

  #parseRawData(fileData) {
    const eachData = fileData.trim().split('\n');
    return eachData.slice(1).map((data) => {
      const [name, price, quantity, promotion] = data.split(',');
      return {
        name,
        price: Number(price),
        quantity: Number(quantity),
        promotion,
      };
    });
  }

  #reinforceProductInfo(parsedData) {
    const productInfo = [];
    parsedData.forEach((product) =>
      this.#addProduct(product, productInfo, parsedData)
    );
    return productInfo;
  }

  #addProduct(product, productInfo, parsedData) {
    this.#addPromotionProduct(product, productInfo);
    this.#addNonPromotionProductIfMissing(product, productInfo, parsedData);
    this.#addNonPromotionProduct(product, productInfo);
  }

  #addPromotionProduct(product, productInfo) {
    if (product.promotion !== 'null') {
      productInfo.push({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        promotion: product.promotion,
      });
    }
  }

  #addNonPromotionProductIfMissing(product, productInfo, parsedData) {
    if (
      product.promotion !== 'null' &&
      !this.#checkNonPromotionProductExistence(product.name, parsedData)
    ) {
      productInfo.push({
        name: product.name,
        price: product.price,
        quantity: 0,
        promotion: 'null',
      });
    }
  }

  #addNonPromotionProduct(product, productInfo) {
    if (product.promotion === 'null') {
      productInfo.push({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        promotion: 'null',
      });
    }
  }

  #checkNonPromotionProductExistence(name, parsedData) {
    return parsedData.find(
      (item) => item.name === name && item.promotion === 'null'
    );
  }
}

export default Stock;
