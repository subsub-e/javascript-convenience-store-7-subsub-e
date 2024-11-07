import fs from 'fs';
import Stock from '../src/models/Stock.js';
import ERROR_MESSAGES from '../src/constants/errorConstants.js';

jest.mock('fs');

describe('Stock 모델 테스트', () => {
  const mockProductData = `
name,price,quantity,promotion
콜라,1000,10,탄산2+1
콜라,1000,10,null
사이다,1000,8,탄산2+1
사이다,1000,7,null
오렌지주스,1800,9,MD추천상품
탄산수,1200,5,탄산2+1
물,500,10,null
비타민워터,1500,6,null
  `;

  beforeEach(() => {
    fs.readFileSync.mockReturnValue(mockProductData);
  });

  test('getProductInfo 메소드 테스트', () => {
    const stock = new Stock();
    const productInfo = stock.getProductInfo();

    expect(productInfo).toEqual([
      { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
      { name: '콜라', price: 1000, quantity: 10, promotion: 'null' },
      { name: '사이다', price: 1000, quantity: 8, promotion: '탄산2+1' },
      { name: '사이다', price: 1000, quantity: 7, promotion: 'null' },
      { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
      { name: '탄산수', price: 1200, quantity: 5, promotion: '탄산2+1' },
      { name: '물', price: 500, quantity: 10, promotion: 'null' },
      { name: '비타민워터', price: 1500, quantity: 6, promotion: 'null' },
    ]);
  });

  test.each([[{ 나랑드사이다: 1 }], [{ 나랑드사이다: 1, 콜라: 2 }]])(
    'checkPurchaseInfo 메소드 테스트: 구매 정보에 존재하지 않는 제품이 있으면 에러를 발생시킨다.',
    (purchaseInfo) => {
      const stock = new Stock();
      expect(() => stock.checkPurchaseInfo(purchaseInfo)).toThrowError(
        ERROR_MESSAGES.PRODUCT_NOT_FOUND
      );
    }
  );

  test.each([[{ 콜라: 20, 물: 1 }], [{ 콜라: 20 }]])(
    'checkOutOfStock 메소드 테스트: 재고 수량을 초과하여 구매할 경우 에러를 발생시킨다.',
    (purchaseInfo) => {
      const stock = new Stock();
      expect(() => stock.checkOutOfStock(purchaseInfo)).toThrowError(
        ERROR_MESSAGES.OUT_OF_STOCK_LIMIT
      );
    }
  );

  test.each([
    [{ 콜라: 5, 사이다: 3 }],
    [{ 물: 10 }],
    [{ 비타민워터: 2 }],
    [{ 오렌지주스: 1, 콜라: 1, 사이다: 1 }],
  ])('정상적인 구매 정보는 에러를 던지지 않는다', (purchaseInfo) => {
    const stock = new Stock();
    expect(() => stock.checkPurchaseInfo(purchaseInfo)).not.toThrow();
    expect(() => stock.checkOutOfStock(purchaseInfo)).not.toThrow();
  });
});
