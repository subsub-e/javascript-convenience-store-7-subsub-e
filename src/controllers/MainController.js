import StoreController from './StoreController.js';
import InputService from '../services/InputService.js';
import Stock from '../models/Stock.js';

class Controller {
  open() {
    const inputService = new InputService();
    const storeController = new StoreController(inputService);
    const stock = new Stock();
    storeController.start(stock);
  }
}

export default Controller;
