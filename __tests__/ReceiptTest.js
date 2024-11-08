import Receipt from '../src/models/Receipt.js';

describe('Receipt 클래스 테스트', () => {
  test.each([
    ['사이다', 3, 3000],
    ['감자칩', 1, 1500],
    ['콜라', 10, 10000],
    ['컵라면', 1, 1700],
    ['탄산수', 5, 6000],
  ])('addPurchaseInfo 메소드 테스트', (productName, quantity, totalPrice) => {
    const receipt = new Receipt();
    receipt.addPurchaseInfo(productName, quantity, totalPrice);

    const receiptData = receipt.getReceipt();
    expect(receiptData.totalPurchasePrice).toBe(totalPrice);
  });

  test.each([
    ['사이다', 1, 1000, 3000],
    ['콜라', 3, 3000, 10000],
    ['탄산수', 1, 1200, 6000],
  ])(
    'addPromotionInfo 메소드 테스트',
    (
      promotionName,
      promotionAppliedCount,
      totalPromotionDiscountPrice,
      totalPrice
    ) => {
      const receipt = new Receipt();
      receipt.addPurchaseInfo('사이다', 3, 3000);
      receipt.addPurchaseInfo('콜라', 10, 10000);
      receipt.addPurchaseInfo('탄산수', 5, 6000);
      receipt.addPromotionInfo(
        promotionName,
        promotionAppliedCount,
        totalPromotionDiscountPrice,
        totalPrice
      );

      const receiptData = receipt.getReceipt();
      expect(receiptData.totalPromotionPrice).toBe(totalPromotionDiscountPrice);
    }
  );

  test('getReceipt 메소드 테스트', () => {
    const receipt = new Receipt();
    receipt.addPurchaseInfo('사이다', 3, 3000);
    receipt.addPromotionInfo('사이다', 1, 1000, 3000);
    receipt.addPurchaseInfo('감자칩', 1, 1500);
    receipt.addPurchaseInfo('콜라', 10, 10000);
    receipt.addPromotionInfo('콜라', 3, 3000, 10000);
    receipt.addPurchaseInfo('컵라면', 1, 1700);
    receipt.addPurchaseInfo('탄산수', 5, 6000);
    receipt.addPromotionInfo('탄산수', 1, 1200, 6000);

    const receiptData = receipt.getReceipt();
    expect(receiptData.purchaseList).toHaveLength(5);
    expect(receiptData.purchaseList[0].name).toBe('사이다');
    expect(receiptData.purchaseList[1].name).toBe('감자칩');
    expect(receiptData.purchaseList[2].name).toBe('콜라');
    expect(receiptData.purchaseList[3].name).toBe('컵라면');
    expect(receiptData.purchaseList[4].name).toBe('탄산수');
    expect(receiptData.promotionList).toHaveLength(3);
    expect(receiptData.promotionList[0].name).toBe('사이다');
    expect(receiptData.promotionList[1].name).toBe('콜라');
    expect(receiptData.promotionList[2].name).toBe('탄산수');
    expect(receiptData.totalPurchasePrice).toBe(22200);
    expect(receiptData.totalPromotionPrice).toBe(5200);
    expect(receiptData.membershipDiscount).toBe(960);
    expect(receiptData.totalReturn).toBe(16040);
  });
});
