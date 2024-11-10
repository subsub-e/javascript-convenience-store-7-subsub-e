import StoreController from './StoreController.js';
import InputService from '../services/InputService.js';
import Stock from '../models/Stock.js';

class MainController {
  async open() {
    const inputService = new InputService();
    const storeController = new StoreController(inputService);
    const stock = new Stock();
    await storeController.start(stock);
  }
}

export default MainController;
