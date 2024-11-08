import MainController from "./controllers/MainController.js";

class App {
  async run() {
    const controller = new MainController();
    controller.open();
  }
}

export default App;
