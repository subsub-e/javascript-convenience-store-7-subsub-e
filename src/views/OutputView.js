import OUTPUT_MESSAGES from "../constants/outputConstants.js";
import { Console } from "@woowacourse/mission-utils";
import {
  formatPrice,
  formatQuantity,
  formatPromotion,
} from "../utils/formatting.js";

class OutputView {
  static printNewLine() {
    Console.print("");
  }

  static printErrorMessage(errorMessage) {
    Console.print(errorMessage);
  }

  static showWelcomeMessage() {
    Console.print(OUTPUT_MESSAGES.Greetings);
  }

  static showProductStockInfo(products) {
    products.forEach((product) => {
      const { name, price, quantity, promotion } = product;
      const formattedPrice = formatPrice(price);
      const formattedQuantity = formatQuantity(quantity);
      const promotionMessage = formatPromotion(promotion);

      Console.print(
        `${OUTPUT_MESSAGES.DASH} ${name} ${formattedPrice} ${formattedQuantity}${promotionMessage}`
      );
    });
    this.printNewLine();
  }

  static showReceipt(receipt) {
    const result = receipt.getReceipt();
    const totalPurchasePriceLength = this.calculateMaxPriceLength(result);
    this.printReceiptHeader();
    result.purchaseList.forEach((item) =>
      this.printPurchaseItem(item, totalPurchasePriceLength)
    );
    Console.print(OUTPUT_MESSAGES.PROMOTION_INFO);
    result.promotionList.forEach((item) => this.printPromotionItem(item));
    Console.print(OUTPUT_MESSAGES.DIVISION_LINE);
    this.printResult(result, totalPurchasePriceLength);
  }

  static calculateMaxPriceLength(result) {
    return Math.max(
      result.totalPurchasePrice.toLocaleString().length,
      Math.max(
        result.totalPromotionPrice.toLocaleString().length +
          OUTPUT_MESSAGES.DASH.length,
        result.membershipDiscount.toLocaleString().length +
          OUTPUT_MESSAGES.DASH.length
      )
    );
  }

  static printReceiptHeader() {
    Console.print(OUTPUT_MESSAGES.RECEIPT_HEADER);
    Console.print(
      `${OUTPUT_MESSAGES.GOODS.padEnd(14, " ")}${OUTPUT_MESSAGES.AMOUNT.padEnd(
        7,
        " "
      )}${OUTPUT_MESSAGES.PRICE}`
    );
  }

  static printPurchaseItem(item, totalPurchasePriceLength) {
    const itemName = item.name.padEnd(17 - item.name.length, " ");
    const itemQuantity = item.quantity.toString().padEnd(15 - totalPurchasePriceLength," ");
    const itemPrice = item.totalPrice.toLocaleString();
    Console.print(`${itemName}${itemQuantity}${itemPrice}`);
  }

  static printPromotionItem(item) {
    const itemName = item.name.padEnd(17 - item.name.length, " ");
    const itemQuantity = item.quantity;
    Console.print(`${itemName}${itemQuantity}`);
  }

  static printResult(result, totalPurchasePriceLength) {
    this.printTotalPurchaseAmount(result, totalPurchasePriceLength);
    this.printPromotionDiscount(result, totalPurchasePriceLength);
    this.printMembershipDiscount(result, totalPurchasePriceLength);
    this.printMoneyToPay(result);
  }

  static printTotalPurchaseAmount(result, totalPurchasePriceLength) {
    Console.print(
      `${OUTPUT_MESSAGES.TOTAL_PURCHASE_AMOUNT.padEnd(
        13,
        " "
      )}${result.totalPurchaseAmount
        .toString()
        .padEnd(
          15 - totalPurchasePriceLength,
          " "
        )}${result.totalPurchasePrice.toLocaleString()}`
    );
  }

  static printPromotionDiscount(result, totalPurchasePriceLength) {
    Console.print(
      `${OUTPUT_MESSAGES.EVENT_DISCOUNT.padEnd(
        28 - totalPurchasePriceLength,
        " "
      )}${OUTPUT_MESSAGES.DASH}${result.totalPromotionPrice.toLocaleString()}`
    );
  }

  static printMembershipDiscount(result, totalPurchasePriceLength) {
    Console.print(
      `${OUTPUT_MESSAGES.MEMBERSHIP_DISCOUNT.padEnd(
        27 - totalPurchasePriceLength,
        " "
      )}${OUTPUT_MESSAGES.DASH}${result.membershipDiscount.toLocaleString()}`
    );
  }

  static printMoneyToPay(result) {
    Console.print(
      `${OUTPUT_MESSAGES.MONEY_TO_PAY.padEnd(
        29 - result.totalReturn.toLocaleString().length,
        " "
      )}${result.totalReturn.toLocaleString()}`
    );
  }
}

export default OutputView;
