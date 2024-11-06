import OUTPUT_MESSAGES from '../constants/outputConstants.js';
import { Console } from '@woowacourse/mission-utils';
import {
  formatPrice,
  formatQuantity,
  formatPromotion,
} from '../utils/formatting.js';

class OutputView {
  static printNewLine() {
    Console.print('');
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

  static showReceipt(purchaseInfo, promotionInfo, resultInfo) {
    Console.print(OUTPUT_MESSAGES.RECEIPT_HEADER);
    Console.print(purchaseInfo);
    Console.print(OUTPUT_MESSAGES.PROMOTION_INFO);
    Console.print(promotionInfo);
    Console.print(OUTPUT_MESSAGES.DIVISION_LINE);
    Console.print(resultInfo);
  }
}

export default OutputView;
