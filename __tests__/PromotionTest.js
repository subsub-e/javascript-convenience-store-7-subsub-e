import fs from 'fs';
import Promotion from '../src/models/Promotion';

jest.mock('fs');

describe('Promotion 모델 테스트', () => {
  const mockPromotionData = `
name,buy,get,startDate,endDate
콜라,2,1,2024-11-01,2024-12-31
사이다,1,1,2024-11-05,2024-12-31
오렌지주스,3,1,2024-05-01,2024-07-31
탄산수,2,1,2024-12-01,2024-12-31
물,1,1,2024-01-01,2024-04-30
비타민워터,2,1,2024-11-01,2024-12-31
  `;

  beforeEach(() => {
    fs.readFileSync.mockReturnValue(mockPromotionData);
  });

  test('getPromotionInfo 메소드 테스트 : 오늘 날짜 기준으로 유효한 프로모션을 반환한다.', () => {
    const promotion = new Promotion();
    const todayPromotionInfo = promotion.getPromotionInfo();

    expect(todayPromotionInfo).toEqual([
      {
        name: '콜라',
        buy: 2,
        get: 1,
        startDate: '2024-11-01',
        endDate: '2024-12-31',
      },
      {
        name: '사이다',
        buy: 1,
        get: 1,
        startDate: '2024-11-05',
        endDate: '2024-12-31',
      },
      {
        name: '비타민워터',
        buy: 2,
        get: 1,
        startDate: '2024-11-01',
        endDate: '2024-12-31',
      },
    ]);
  });
});
