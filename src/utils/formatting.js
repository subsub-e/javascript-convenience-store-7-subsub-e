import CONVENIENCE_STORE_CONSTANTS from '../constants/convenienceStoreConstants.js';

export const formatPrice = (price) => {
  return `${price.toLocaleString()}${CONVENIENCE_STORE_CONSTANTS.MONEY_UNIT}`;
};

export const formatQuantity = (quantity) => {
  if (quantity > CONVENIENCE_STORE_CONSTANTS.STOCK_IS_ZERO) {
    return `${quantity}${CONVENIENCE_STORE_CONSTANTS.QUANTITY}`;
  }
  return CONVENIENCE_STORE_CONSTANTS.OUT_OF_STOCK;
};

export const formatPromotion = (promotion) => {
  if (promotion !== 'null') {
    return ` ${promotion}`;
  }
  return '';
};

export const formatPurchaseInfo = (inputPurchaseInfo) => {
  const parseArray = parseInputPurchaseInfo(inputPurchaseInfo);

  const result = {};
  parseArray.forEach((item) => {
    const [name, quantity] = item.split('-');
    result[name] = Number(quantity);
  });

  return result;
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

const parseInputPurchaseInfo = (inputPurchaseInfo) => {
  if (inputPurchaseInfo.indexOf(',') != -1) {
    return inputPurchaseInfo.split(',').map((product) => product.slice(1, -1));
  }
  return [inputPurchaseInfo.slice(1, -1)];
};
