class Receipt {
  #purchaseList;
  #promotionList;
  #totalPurchasePrice;
  #totalPromotionPrice;
  #membershipDiscount;

  constructor() {
    this.#purchaseList = [];
    this.#promotionList = [];
    this.#totalPurchasePrice = 0;
    this.#totalPromotionPrice = 0;
    this.#membershipDiscount = 0;
  }

  addPurchaseInfo(productName, quantity, totalPrice) {
    this.#purchaseList.push({
      name: productName,
      quantity: quantity,
      totalPrice: totalPrice,
    });
    this.#totalPurchasePrice += totalPrice;
    this.#membershipDiscount += totalPrice;
  }

  addPromotionInfo(
    promotionAppliedProductName,
    promotionAppliedCount,
    totalPromotionDiscountPrice,
    totalPrice
  ) {
    this.#promotionList.push({
      name: promotionAppliedProductName,
      quantity: promotionAppliedCount,
    });
    this.#totalPromotionPrice += totalPromotionDiscountPrice;
    this.#membershipDiscount -= totalPrice;
  }

  getReceipt() {
    return {
      purchaseList: this.#purchaseList,
      promotionList: this.#promotionList,
      totalPurchaseAmount : this.#calculateTotalAmount(),
      totalPurchasePrice: this.#totalPurchasePrice,
      totalPromotionPrice: this.#totalPromotionPrice,
      membershipDiscount: this.#calculateMembershipDiscount(
        this.#membershipDiscount
      ),
      totalReturn: this.#calculateTotalReturn(),
    };
  }

  noMembershipDiscount() {
    this.#membershipDiscount = 0;
  }

  #calculateTotalAmount() {
    return this.#purchaseList.reduce((total, item) => total + item.quantity, 0);
  }
  

  #calculateMembershipDiscount(membershipDiscount) {
    const calculatedDiscount = membershipDiscount * 0.3;

    if (calculatedDiscount > 8000) {
      return 8000;
    }
    return calculatedDiscount;
  }

  #calculateTotalReturn() {
    return (
      this.#totalPurchasePrice -
      this.#totalPromotionPrice -
      this.#calculateMembershipDiscount(this.#membershipDiscount)
    );
  }
}

export default Receipt;
