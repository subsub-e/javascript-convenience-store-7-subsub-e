import INPUT_MESSAGES from '../constants/inputConstants.js';
import { Console } from '@woowacourse/mission-utils';

class InputView {
  static async readPurchaseItemAndQuantity() {
    return Console.readLineAsync(INPUT_MESSAGES.PURCHASE_ITEM_AND_QUANTITY);
  }

  static async readAddQuantityDecision(promotionGoodsName) {
    return Console.readLineAsync(
      `${INPUT_MESSAGES.NOW} ${promotionGoodsName} ${INPUT_MESSAGES.ADD_PROMOTION_QUANTITY}`
    );
  }

  static async readPayNonPromotionItem(
    promotionGoodsName,
    promotionGoodsAmount
  ) {
    return Console.readLineAsync(
      `${INPUT_MESSAGES.NOW} ${promotionGoodsName} ${promotionGoodsAmount} ${INPUT_MESSAGES.PAY_NONPROMOTION_ITEM}`
    );
  }

  static async readMembershipDiscount() {
    return Console.readLineAsync(INPUT_MESSAGES.MEMBERSHIP_DISCOUNT);
  }

  static async readMorePurchase() {
    return Console.readLineAsync(INPUT_MESSAGES.MORE_PURCHASE);
  }
}

export default InputView;
