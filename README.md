# 🏪 편의점

우아한테크코스 프리코스 4주차 과제입니다.<br/>

편의점에 있는 재고를 알려주고 구매자가 해당 재고를 구매하는 시스템을 구현합니다.<br/>

구매자의 할인 혜택과 재고 상황을 고려하여 최종 결제 금액을 계산하고 안내합니다.<br/>

구매 내역과 산출한 금액 정보를 영수증으로 출력합니다.<br/>

JavaScript로 구현하고 Jest를 통해 테스트 하였으며, MVC패턴을 적용하여 설계했습니다.

<br/><br/>

## 🗒️ 기능 목록

✔️ 시작

- 구현에 필요한 상품 목록과 행사 목록을 파일 입출력을 통해 불러온다.
<br/>

✔️ 입력

- 구매할 상품과 수량을 입력받는다.
- 상품명과 수량은 ‘-’으로 연결하고, 개별 상품은 [] 로 묶어 ‘,’로 구분한다. (ex. [콜라-10],[사이다-3])
- 프로모션이 적용 가능한 상품 중에 고객이 해당 수량보다 적게 가져온 경우, 그 수량만큼 추가 여부를 입력받는다. (’Y’, ‘N’ 으로 구분)
- 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부를 입력받는다. (’Y’, ‘N’ 으로 구분)
- 멤버십 할인 적용 여부를 입력 받는다. (’Y’, ‘N’ 으로 구분)
- 추가 구매 여부를 입력 받는다. (’Y’, ‘N’ 으로 구분)
- 잘못된 값을 입력할 경우 Error를 발생시키고 해당 지점부터 다시 실행
    - 구매한 상품과 수량을 입력받을때 정해진 형식을 지키지 않는 경우 : “[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.”
    - ‘Y’, ‘N’ 으로 구분해야 할때 해당 예약어가 아닌 다른 값을 입력하는 경우 : “[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.”
    - 존재하지 않는 상품을 입력한 경우 : “[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.”
    - 구매 수량이 재고 수량을 초과한 경우 : “[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.” 
    <br/>

✔️ 편의점 재고 관리

- 각 상품의 재고 수량을 고려하여 결제 가능 여부를 확인한다.(재고보다 구매 수량이 많으면 ERROR 발생)
- 고객이 상품을 구매할 때마다, 결제된 수량만큼 해당 상품의 재고에서 차감하여 수량을 관리한다.
- 재고를 차감함으로써 시스템은 최신 재고 상태를 유지하며, 다음 고객이 구매할 때 정확한 재고 정보를 제공한다.<br/>

✔️ 편의점 프로모션

- 오늘 날짜가 프로모션 기간 내에 포함된 경우에만 할인을 적용한다.
- 프로모션은 N개 구매 시 1개 무료 증정(Buy N Get 1 Free)의 형태로 진행된다.
- 1+1 또는 2+1 프로모션이 각각 지정된 상품에 적용되며, 동일 상품에 여러 프로모션이 적용되지 않는다.
- 프로모션 혜택은 프로모션 재고 내에서만 적용할 수 있다.(일반 상품 재고와 다르게 관리)
- 프로모션 기간 중이라면 프로모션 재고를 우선적으로 차감하며, 프로모션 재고가 부족할 경우에는 일반 재고를 사용한다.(프로모션을 진행중이고 프로모션 적용 상품을 구매한다면 프로모션 재고에서 차감, 만약 프로모션 진행중인데 프로모션 적용 상품을 구매하는데 프로모션 재고가 없다면 안내 메시지 출력하고 구매 하게 되면 일반 수량에서 차감, 만약 일반 수량도 없다면 ERROR 발생)
- 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우, 필요한 수량을 추가로 가져오면 혜택을 받을 수 있음을 안내한다.
- 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제하게 됨을 안내한다.<br/>

✔️ 편의점 맴버십

- 멤버십 회원은 프로모션 미적용 금액의 30%를 할인받는다.(프로모션 적용된 상품의 금액 제외한 나머지 상품들의 합의 30% 할인)
- 프로모션 적용 후 남은 금액에 대해 멤버십 할인을 적용한다.
- 멤버십 할인의 최대 한도는 8,000원이다.(멤버십 할인 금액이 8000원이 넘어가면 8000까지만 할인)<br/>

✔️ 출력

- 환영 인사와 함께 상품명, 가격, 재고, 프로모션 이름을 안내한다. 만약 재고가 0개라면 ”재고 없음”을 출력한다.
- 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져오지 않았을 경우, 혜택에 대한 안내 메시지를 출력한다.
- 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부에 대한 안내 메시지를 출력한다.
- 멤버십 할인 적용 여부를 확인하기 위해 안내 문구를 출력한다.
- 영수증의 구성 요소를 보기 좋게 정렬하여 출력한다. (구매 상품 내역, 증정 상품 내역, 금액 정보)
- 추가 구매 여부를 확인하기 위해 안내 문구를 출력한다.<br/><br/>

## 📦 다이어그램
![diagram](https://github.com/user-attachments/assets/ecc7cccb-fba9-4ac8-a286-9a90bd95ea84)



## ✅ 체크리스트

1. 단일 책임 원칙에 기반하여 각 함수는 하나의 기능만 수행하도록 구현한다.<br/>
2. 함수(또는 메서드)의 길이가 10라인을 넘어가지 않도록 구현한다.<br/>
3. else를 지양한다.<br/>
4. 입출력을 담당하는 클래스를 별도로 구현한다.<br/>
5. 객체의 상태 접근을 제한한다.(private class 필드로 구현)<br/>
6. 객체는 객체답게 사용한다.(자신의 데이터를 스스로 처리하도록 메세지를 던지게 한다.) <br/>
7. 함수의 indent(인덴트, 들여쓰기) depth는 2까지만 허용한다.<br/>
8. 3항 연산자를 쓰지 않는다.<br/>
9. 값을 하드코딩 하지 않는다. (const를 정의하고 의미 있는 이름을 부여한다.)<br/>
10. Jest를 활용하여 프로젝트 상세 설계를 통해 나눈 기능들에 대해 단위테스트를 진행한다.<br/>
11. 커밋 메세지를 의미있게 작성한다.<br/>
12. 의미 없는 주석을 달지 않는다. (이름을 통해 의미를 나타낸다)<br/>
13. 코드 포맷팅을 사용한다.<br/>
14. JavaScript에서 제공하는 API를 적극 활용한다.<br/>
15. Airbnb의 자바스크립트 스타일 가이드인 작음따옴표를 사용한다.<br/><br/>

## **📥 실행 방법**

1. 레포지토리 클론

```
git clone <https://github.com/subsub-e/javascript-calculator-7.git>

```

1. 의존성 모듈 설치

```
npm install

```

1. 프로젝트 실행

```
npm run start

```

1. 프로젝트 테스트

```
npm run test

```

<br/><br/>

## 🧑‍💻 필요 개발 환경

✔️ npm ≥ 10.8.2

✔️ node ≥ 20.17.0
<br/><br/>

## 📖 **라이브러리**

- `@woowacourse/mission-utils`에서 제공하는 `Console` 및 `DateTimes` API를 사용하여 구현해야 한다.
    - 현재 날짜와 시간을 가져오려면 `DateTimes`의 `now()`를 활용한다.
    - 사용자의 값을 입력 및 출력하려면 `Console.readLineAsync()`와 `Console.print()`를 활용한다.
