import Promotion from '../models/Promotion.js';

class PaymentService {
  constructor(inputService) {
    this.inputService = inputService;
  }

  async start(purchaseInfo, stock, result) {
    const promotion = new Promotion();
    const promotionInfo = promotion.getPromotionInfo();
    
    for (const productName of Object.keys(purchaseInfo)) {
      await this.#eachProductPurchase(productName, purchaseInfo, stock, promotionInfo, result);
    }
  }
  
  async #eachProductPurchase(productName, purchaseInfo, stock, promotionInfo, result) {
    const products = stock.findProductsInStock(productName);
    const quantityNeeded = purchaseInfo[productName];
    const promotionDetail = this.#getPromotionDetail(products, promotionInfo);
  
    if (promotionDetail) {
      await this.#applyPromotion(products, promotionDetail, quantityNeeded, stock, result);
    } else {
      this.#purchaseWithoutPromotion(products, quantityNeeded, stock, result);
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

  #purchaseWithoutPromotion(products, quantityNeeded, stock, result) {
    this.#purchase(products, quantityNeeded, stock, result);
    stock.subtrackStock(products[0], quantityNeeded);
  }

  async #applyPromotion(products, promotionDetail, quantityNeeded, stock, result) {
    const promoProductInfo = this.#findPromotionProduct(products);
    const isStockSufficient = this.#isStockSufficient(promoProductInfo, promotionDetail,quantityNeeded);

    if (isStockSufficient) {
      await this.#applyFullPromotion(promoProductInfo, promotionDetail, quantityNeeded, stock, result);
    } else {
      await this.#applyPartialPromotion(promoProductInfo, promotionDetail, quantityNeeded, stock, result);
    }
  }

  #isStockSufficient(productInfo, promotionDetail, quantityNeeded) {
    return (
      productInfo.quantity >= promotionDetail.buy + promotionDetail.get &&
      productInfo.quantity > quantityNeeded
    );
  }

  async #applyPartialPromotion(productInfo, promotionDetail, quantityNeeded, stock, result) {
    const applyPromotionAmount = this.#calculateApplyPromotionAmount(productInfo, promotionDetail);
    const answer = await this.inputService.askToPayNonPromotionItem({
      name: productInfo.name,
      quantity: quantityNeeded - applyPromotionAmount,
    });

    if (answer === 'Y') {
      this.#processPartialPayment(productInfo, promotionDetail, quantityNeeded, applyPromotionAmount, stock, result);
    } else {
      this.#processPartialPromotionOnly(productInfo, promotionDetail, applyPromotionAmount, stock, result);
    }
  }

  #calculateApplyPromotionAmount(productInfo, promotionDetail) {
    return (
      productInfo.quantity -
      (productInfo.quantity % (promotionDetail.buy + promotionDetail.get))
    );
  }

  #processPartialPayment(productInfo, promotionDetail, quantityNeeded, applyPromotionAmount, stock, result) {
    this.#addPromotion(
      productInfo.name,
      applyPromotionAmount / (promotionDetail.buy + promotionDetail.get),
      quantityNeeded,
      stock,
      result
    );
    this.#purchase([productInfo], quantityNeeded, stock, result);
    this.#subtrackStockAfterPurchase(stock, productInfo, quantityNeeded);
  }

  #processPartialPromotionOnly(productInfo, promotionDetail, applyPromotionAmount, stock, result) {
    this.#addPromotion(
      productInfo.name,
      applyPromotionAmount / (promotionDetail.buy + promotionDetail.get),
      applyPromotionAmount,
      stock,
      result
    );
    this.#purchase([productInfo], applyPromotionAmount, stock, result);
    stock.subtrackStock(productInfo, applyPromotionAmount);
  }

  async #applyFullPromotion(hasPromotionProductInfo, promotionDetail, quantity, stock, result) {
    const promotionQuantity = this.#calculatePromotionQuantity(quantity, promotionDetail);
    
    if (this.#canUserReceiveAdditionalItems(hasPromotionProductInfo, promotionDetail, quantity)) {
      await this.#handleAdditionalItems(hasPromotionProductInfo, promotionDetail, promotionQuantity, quantity, stock, result);
    } else {
      this.#purchasePromotionProduct(hasPromotionProductInfo, promotionQuantity, quantity, stock, result);
    }
  }
  
  #calculatePromotionQuantity(quantity, promotionDetail) {
    return Math.floor(quantity / (promotionDetail.buy + promotionDetail.get)) * promotionDetail.get;
  }
  
  async #handleAdditionalItems(hasPromotionProductInfo, promotionDetail, promotionQuantity, quantity, stock, result) {
    const userWantsAdditionalItems = await this.#askUserForAdditionalItems(hasPromotionProductInfo);
    if (userWantsAdditionalItems) {
      this.#purchasePromotionProduct(hasPromotionProductInfo,
        promotionQuantity + promotionDetail.get,
        quantity + promotionDetail.get,
        stock,
        result
      );
    } else {
      this.#purchasePromotionProduct(hasPromotionProductInfo, promotionQuantity, quantity, stock, result);
    }
  }
  

  #canUserReceiveAdditionalItems(hasPromotionProductInfo, promotionDetail, quantity) {
    return (
      quantity + promotionDetail.get <= hasPromotionProductInfo.quantity &&
      quantity % (promotionDetail.buy + promotionDetail.get) === promotionDetail.buy
    );
  }
  

  async #askUserForAdditionalItems(hasPromotionProductInfo) {
    const answer = await this.inputService.askToAddPromotionQuantity(
      hasPromotionProductInfo.name
    );
    return answer === 'Y';
  }

  #purchasePromotionProduct(productInfo, promotionQty, quantity, stock, result) {
    if (promotionQty > 0) {
      this.#addPromotion(productInfo.name, promotionQty, quantity, stock, result);
    }
    this.#purchase([productInfo], quantity, stock, result);
    stock.subtrackStock(productInfo, quantity);
  }

  #findPromotionProduct(products) {
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

  #subtrackStockAfterPurchase(stock, productInfo, quantityNeeded) {
    stock.subtrackStock(productInfo, productInfo.quantity);
    stock.additionalSubtrackStock(
      productInfo.name,
      quantityNeeded - productInfo.quantity
    );
  }
}

export default PaymentService;
