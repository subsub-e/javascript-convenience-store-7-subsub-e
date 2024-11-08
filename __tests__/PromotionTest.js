import fs from 'fs';
import Promotion from '../src/models/Promotion';

jest.mock('fs');

describe('Promotion 모델 테스트', () => {
  const mockPromotionData = `
name,buy,get,startDate,endDate
콜라,2,1,2024-11-01,2024-11-10
사이다,1,1,2024-11-05,2024-11-10
오렌지주스,3,1,2024-11-01,2024-11-07
탄산수,2,1,2024-11-08,2024-11-15
물,1,1,2024-11-01,2024-11-10
비타민워터,2,1,2024-11-01,2024-11-15
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
        endDate: '2024-11-10',
      },
      {
        name: '사이다',
        buy: 1,
        get: 1,
        startDate: '2024-11-05',
        endDate: '2024-11-10',
      },
      {
        name: '탄산수',
        buy: 2,
        get: 1,
        startDate: '2024-11-08',
        endDate: '2024-11-15',
      },
      {
        name: '물',
        buy: 1,
        get: 1,
        startDate: '2024-11-01',
        endDate: '2024-11-10',
      },
      {
        name: '비타민워터',
        buy: 2,
        get: 1,
        startDate: '2024-11-01',
        endDate: '2024-11-15',
      },
    ]);
  });
});
