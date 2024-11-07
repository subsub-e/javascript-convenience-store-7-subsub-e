import {
  formatPrice,
  formatQuantity,
  formatPromotion,
  formatPurchaseInfo,
} from '../src/utils/formatting.js';
import CONVENIENCE_STORE_CONSTANTS from '../src/constants/convenienceStoreConstants.js';

describe('formatting 테스트', () => {
  test.each([
    [1000, '1,000원'],
    [20000, '20,000원'],
    [500, '500원'],
  ])('formatPrice 함수 테스트', (price, expectedResult) => {
    expect(formatPrice(price)).toBe(expectedResult);
  });

  test.each([
    [10, '10개'],
    [0, CONVENIENCE_STORE_CONSTANTS.OUT_OF_STOCK],
    [100, '100개'],
  ])('formatQuantity 함수 테스트', (quantity, expectedResult) => {
    expect(formatQuantity(quantity)).toBe(expectedResult);
  });

  test.each([
    ['탄산2+1', ' 탄산2+1'],
    ['null', ''],
    ['MD추천상품', ' MD추천상품'],
    ['반짝할인', ' 반짝할인'],
  ])('formatPromotion 함수 테스트', (promotion, expectedResult) => {
    expect(formatPromotion(promotion)).toBe(expectedResult);
  });

  test.each([
    ['[사이다-2],[감자칩-1]', { 사이다: 2, 감자칩: 1 }],
    ['[사이다-10]', { 사이다: 10 }],
    ['[사이다-10],[감자칩-1],[오렌지-3]', { 사이다 : 10, 감자칩: 1, 오렌지 : 3 }],
  ])(
    'formatPurchaseInfo 함수 테스트',
    (inputPurchaseInfo, expectedResult) => {
      expect(formatPurchaseInfo(inputPurchaseInfo)).toEqual(expectedResult);
    }
  );
});
