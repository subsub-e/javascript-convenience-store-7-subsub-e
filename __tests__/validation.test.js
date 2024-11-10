import {
  validateAnswer,
  validatePurchaseInfo
} from '../src/utils/validation.js';
import ERROR_MESSAGES from '../src/constants/errorConstants.js';

describe('validateAnswer 함수 테스트', () => {
  test.each([['Y'], ['N']])(
    'validateAnswer 함수 테스트 : Y나 N을 입력하는 경우',
    (answer) => {
      expect(() => validateAnswer(answer)).not.toThrow();
    }
  );

  test.each([['A'], [''], [null]])(
    'validateAnswer 함수 테스트 : Y나 N을 입력하지 않고 다른 값을 입력하면 에러를 발생시킨다.',
    (answer) => {
      expect(() => validateAnswer(answer)).toThrow(ERROR_MESSAGES.INVALID_INPUT);
    }
  );
});

describe('validatePurchaseInfo 함수 테스트', () => {
  test.each([
    ['[사이다-2,감자칩-1]'],
    ['[사이다-2][감자칩1]'],
    [''],
    ['1'],
    ['[사이다2]'],
    ['[사이다--2]'],
    ['[사이다-2],[감자칩=2]'],
    ['[사이다-2],[감자칩--2]'],
    ['[사이다-2],]감자칩-2]'],
    ['[사이다-2],[사이다-3]'],
    ['[사이다-2['],
    ['사이다-2'],
    ['[사이다-2],감자칩-2'],
    ['[사이다-2,감자칩-2]'],
  ])(
    '정상적이지 않은 구매 정보를 입력하는 경우 에러를 발생시킨다.',
    (inputPurchaseInfo) => {
      expect(() => validatePurchaseInfo(inputPurchaseInfo)).toThrow(
        ERROR_MESSAGES.INVALID_PURCHASE_FORMAT
      );
    }
  );

  test.each([
    ['[사이다-2],[감자칩-1]'],
    ['[사이다-10]'],
    ['[사이다-10],[감자칩-1],[오렌지-3]'],
  ])('정상적인 구매 정보를 입력하는 경우', (inputPurchaseInfo) => {
    expect(() => validatePurchaseInfo(inputPurchaseInfo)).not.toThrow();
  });
});