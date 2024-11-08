import Promotion from '../models/Promotion.js';

class PaymentService {
  constructor(inputService) {
    this.inputService = inputService;
  }

  async start(purchaseInfo, stock, result) {
    const promotion = new Promotion();
    const promotionInfo = promotion.getPromotionInfo();

    for (const productName of Object.keys(purchaseInfo)) {
      const products = stock.findProductsInStock(productName);
      const quantityNeeded = purchaseInfo[productName];
      const promotionDetail = this.#getPromotionDetail(products, promotionInfo);

      if (!promotionDetail) {
        this.#purchase(products, quantityNeeded, stock, result);
        stock.subtrackStock(products[0], quantityNeeded);
      } else {
        await this.#applyPromotion(
          products,
          promotionDetail,
          quantityNeeded,
          stock,
          result
        );
      }
    }
  }

  #getPromotionDetail(products, promotionInfo) {
    const promotionalProduct = products.find(
      (product) => product.promotion !== 'null'
    );
    if (!promotionalProduct) return null;

    return promotionInfo.find(
      (promotion) => promotion.name === promotionalProduct.promotion
    );
  }

  async #applyPromotion(
    products,
    promotionDetail,
    quantityNeeded,
    stock,
    result
  ) {
    const hasPromotionProductInfo = this.#hasPromotionProduct(products);

    if (
      hasPromotionProductInfo.quantity >=
        promotionDetail.buy + promotionDetail.get &&
      hasPromotionProductInfo.quantity >= quantityNeeded
    ) {
      await this.#applyPromotionIfStockSufficient(
        hasPromotionProductInfo,
        promotionDetail,
        quantityNeeded,
        stock,
        result
      );
    } else {
      await this.#applyPromotionIfStockIsNotSufficient(
        hasPromotionProductInfo,
        promotionDetail,
        quantityNeeded,
        stock,
        result
      );
    }
  }

  async #applyPromotionIfStockIsNotSufficient(
    hasPromotionProductInfo,
    promotionDetail,
    quantityNeeded,
    stock,
    result
  ) {
    const applyPromotionAmount =
      hasPromotionProductInfo.quantity -
      (hasPromotionProductInfo.quantity %
        (promotionDetail.buy + promotionDetail.get));
    const nonPromotionProductInfo = {
      name: hasPromotionProductInfo.name,
      quantity: quantityNeeded - applyPromotionAmount,
    };
    const answer = await this.inputService.askToPayNonPromotionItem(
      nonPromotionProductInfo
    );

    if (answer == 'Y') {
      if (applyPromotionAmount > 0) {
        this.#addPromotion(
          hasPromotionProductInfo.name,
          applyPromotionAmount / (promotionDetail.buy + promotionDetail.get),
          quantityNeeded,
          stock,
          result
        );
      }
      this.#purchase([hasPromotionProductInfo], quantityNeeded, stock, result);
      stock.subtrackStock(
        hasPromotionProductInfo,
        hasPromotionProductInfo.quantity
      );
      stock.additionalSubtrackStock(
        hasPromotionProductInfo.name,
        quantityNeeded - hasPromotionProductInfo.quantity
      );
      return;
    } else {
      if (applyPromotionAmount > 0) {
        this.#addPromotion(
          hasPromotionProductInfo.name,
          applyPromotionAmount / (promotionDetail.buy + promotionDetail.get),
          applyPromotionAmount,
          stock,
          result
        );
        this.#purchase(
          [hasPromotionProductInfo],
          applyPromotionAmount,
          stock,
          result
        );
        stock.subtrackStock(hasPromotionProductInfo, applyPromotionAmount);
      }

      return;
    }
  }

  async #applyPromotionIfStockSufficient(
    hasPromotionProductInfo,
    promotionDetail,
    quantity,
    stock,
    result
  ) {
    const promotionQuantity =
      Math.floor(quantity / (promotionDetail.buy + promotionDetail.get)) *
      promotionDetail.get;

    if (
      this.#canUserReceiveAdditionalItems(
        hasPromotionProductInfo,
        promotionDetail,
        quantity
      )
    ) {
      const answer = await this.inputService.askToAddPromotionQuantity(
        hasPromotionProductInfo.name
      );

      if (answer === 'Y') {
        this.#addPromotion(
          hasPromotionProductInfo.name,
          promotionQuantity + promotionDetail.get,
          quantity + promotionDetail.get,
          stock,
          result
        );
        this.#purchase(
          [hasPromotionProductInfo],
          quantity + promotionDetail.get,
          stock,
          result
        );
        stock.subtrackStock(
          hasPromotionProductInfo,
          quantity + promotionDetail.get
        );
        return;
      } else {
        if (promotionQuantity > 0) {
          this.#addPromotion(
            hasPromotionProductInfo.name,
            promotionQuantity,
            quantity,
            stock,
            result
          );
        }
      }
    } else {
      this.#addPromotion(
        hasPromotionProductInfo.name,
        promotionQuantity,
        quantity,
        stock,
        result
      );
    }

    this.#purchase([hasPromotionProductInfo], quantity, stock, result);
    stock.subtrackStock(hasPromotionProductInfo, quantity);
  }

  #canUserReceiveAdditionalItems(
    hasPromotionProductInfo,
    promotionDetail,
    quantity
  ) {
    if (quantity + promotionDetail.get > hasPromotionProductInfo.quantity) {
      return false;
    }
    if (
      quantity % (promotionDetail.buy + promotionDetail.get) ===
      promotionDetail.buy
    ) {
      return true;
    }
    return false;
  }

  #hasPromotionProduct(products) {
    return products.find((product) => product.promotion !== 'null');
  }

  #purchase(products, quantity, stock, result) {
    result.addPurchaseInfo(
      products[0].name,
      quantity,
      stock.getProductTotalPrice(products[0].name, quantity)
    );
  }

  #addPromotion(productsName, quantity, totalQuantity, stock, result) {
    result.addPromotionInfo(
      productsName,
      quantity,
      stock.getProductTotalPrice(productsName, quantity),
      stock.getProductTotalPrice(productsName, totalQuantity)
    );
  }
}

export default PaymentService;
