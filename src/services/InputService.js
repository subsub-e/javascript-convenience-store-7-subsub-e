import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import { validatePurchaseInfo, validateAnswer } from '../utils/validation.js';
import { formatPurchaseInfo } from '../utils/formatting.js';

class InputService {
  async #readInputUntilValid(
    inputMethod,
    validationFunction,
    isGetPurchaseInfo = null
  ) {
    const input = await inputMethod();
    try {
      validationFunction(input);
      if (isGetPurchaseInfo) {
        return isGetPurchaseInfo(input);
      }
      return input;
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#readInputUntilValid(
        inputMethod,
        validationFunction,
        isGetPurchaseInfo
      );
    }
  }

  async getPurchaseInfo(stock) {
    return this.#readInputUntilValid(
      InputView.readPurchaseItemAndQuantity,
      validatePurchaseInfo,
      (input) => {
        const formattedPurchaseInfo = formatPurchaseInfo(input);
        stock.checkPurchaseInfo(formattedPurchaseInfo);
        stock.checkOutOfStock(formattedPurchaseInfo);
        return formattedPurchaseInfo;
      }
    );
  }

  async askForMembershipDiscount() {
    return this.#readInputUntilValid(
      InputView.readMembershipDiscount,
      validateAnswer
    );
  }

  async askToAddPromotionQuantity(productName) {
    return this.#readInputUntilValid(
      () => InputView.readAddQuantityDecision(productName),
      validateAnswer
    );
  }

  async askToPayNonPromotionItem(nonPromotionProductInfo) {
    return this.#readInputUntilValid(
      () => InputView.readPayNonPromotionItem(nonPromotionProductInfo),
      validateAnswer
    );
  }

  async askForMorePurchase() {
    return this.#readInputUntilValid(
      InputView.readMorePurchase,
      validateAnswer
    );
  }
}

export default InputService;
