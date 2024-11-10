import Receipt from '../models/Receipt.js';
import PaymentService from '../services/PaymentService.js';
import OutputView from '../views/OutputView.js';

class StoreController {
  constructor(inputService) {
    this.inputService = inputService;
  }

  async start(stock) {
    const receipt = new Receipt();
    const paymentService = new PaymentService(this.inputService);
    this.#init(stock);
    const purchaseInfo = await this.inputService.getPurchaseInfo(stock);
    await paymentService.start(purchaseInfo, stock, receipt);
    await this.#checkMembership(receipt);
    OutputView.showReceipt(receipt);
    await this.#handleMorePurchase(stock);
  }

  #init(stock) {
    OutputView.showWelcomeMessage();
    OutputView.showProductStockInfo(stock.getProductInfo());
  }

  async #checkMembership(receipt) {
    const answer = await this.inputService.askForMembershipDiscount();
    if (answer == 'N') {
      receipt.noMembershipDiscount();
    }
  }

  async #handleMorePurchase(stock) {
    const morePurchaseAnswer = await this.inputService.askForMorePurchase();
    if (morePurchaseAnswer === 'Y') {
      OutputView.printNewLine();
      await this.start(stock);
    }
  }
}

export default StoreController;
