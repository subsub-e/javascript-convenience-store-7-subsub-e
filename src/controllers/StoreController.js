import Receipt from '../models/Receipt.js';
import PaymentService from '../services/PaymentService.js';
import OutputView from '../views/OutputView.js';

class StoreController {
  constructor(inputService) {
    this.inputService = inputService;
  }

  async start(stock) {
    const receipt = new Receipt();
    this.#init(stock);

    const purchaseInfo = await this.inputService.getPurchaseInfo(stock);

    const paymentService = new PaymentService(this.inputService);
    await paymentService.start(purchaseInfo, stock, receipt);

    const morePurchaseAnswer = await this.inputService.askForMorePurchase();

    if (morePurchaseAnswer === 'Y') {
      OutputView.printNewLine();
      await this.start(stock);
    }
  }

  #init(stock) {
    OutputView.showWelcomeMessage();
    OutputView.showProductStockInfo(stock.getProductInfo());
  }
}

export default StoreController;
