import InputView from "../views/InputView.js";
import OutputView from "../views/OutputView.js";
import { validatePurchaseInfo, validateAnswer } from "../utils/validation.js";
import { formatPurchaseInfo } from "../utils/formatting.js";

class InputService {
  async #readInputUntilValidWithoutParams(inputMethod, validationFunction) {
    const input = await inputMethod();
    try {
      validationFunction(input);
      return input;
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#readInputUntilValidWithoutParams(
        inputMethod,
        validationFunction
      );
    }
  }

  async #readInputUntilValidWithParams(inputMethod, validationFunction, param) {
    const input = await inputMethod(param);
    try {
      validationFunction(input);
      return input;
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#readInputUntilValidWithParams(
        inputMethod,
        validationFunction,
        param
      );
    }
  }

  #formatAndValidatePurchaseInfo(input, stock) {
    try {
      const formattedPurchaseInfo = formatPurchaseInfo(input);
      stock.checkPurchaseInfo(formattedPurchaseInfo);
      stock.checkOutOfStock(formattedPurchaseInfo);
      return formattedPurchaseInfo;
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.getPurchaseInfo(stock);
    }
  }

  async getPurchaseInfo(stock) {
    const input = await this.#readInputUntilValidWithoutParams(
      InputView.readPurchaseItemAndQuantity,
      validatePurchaseInfo
    );
    return this.#formatAndValidatePurchaseInfo(input, stock);
  }

  async askForMembershipDiscount() {
    return this.#readInputUntilValidWithoutParams(
      InputView.readMembershipDiscount,
      validateAnswer
    );
  }

  async askToAddPromotionQuantity(productName) {
    return this.#readInputUntilValidWithParams(
      InputView.readAddQuantityDecision,
      validateAnswer,
      productName
    );
  }

  async askToPayNonPromotionItem(nonPromotionProductInfo) {
    return this.#readInputUntilValidWithParams(
      InputView.readPayNonPromotionItem,
      validateAnswer,
      nonPromotionProductInfo
    );
  }

  async askForMorePurchase() {
    return this.#readInputUntilValidWithoutParams(
      InputView.readMorePurchase,
      validateAnswer
    );
  }
}

export default InputService;
