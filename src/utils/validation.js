import ERROR_MESSAGES from "../constants/errorConstants.js";

export const validateAnswer = (answer) => {
  if (answer !== "Y" && answer !== "N") {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }
};

export const validatePurchaseInfo = (inputPurchaseInfo) => {
  const purchaseItems = inputPurchaseInfo.split(",");
  const itemSet = new Set();
  purchaseItems.forEach((item) => {
    validateItem(item, itemSet);
  });
};

const validateItem = (item, itemSet) => {
  isValidPurchaseFormat(item);
  const { name, quantity } = extractNameAndQuantity(item);
  if (itemSet.has(name)) {
    throw new Error(ERROR_MESSAGES.INVALID_PURCHASE_FORMAT);
  }
  isValidName(name);
  isValidQuantity(quantity);
  itemSet.add(name);
};


const isValidPurchaseFormat = (item) => {
  if (!item.startsWith("[") || !item.endsWith("]")) {
    throw new Error(ERROR_MESSAGES.INVALID_PURCHASE_FORMAT);
  }
};

const extractNameAndQuantity = (item) => {
  const parseItem = item.slice(1, -1);
  const lastDashIndex = parseItem.lastIndexOf("-");
  return {
    name: parseItem.slice(0, lastDashIndex),
    quantity: Number(parseItem.slice(lastDashIndex + 1)),
  };
};

const isValidName = (name) => {
  const invalidNamePattern = /[^a-zA-Z0-9가-힣]/;
  if (!name || invalidNamePattern.test(name)) {
    throw new Error(ERROR_MESSAGES.INVALID_PURCHASE_FORMAT);
  }
};

const isValidQuantity = (quantity) => {
  if (!quantity || isNaN(quantity) || quantity <= 0) {
    throw new Error(ERROR_MESSAGES.INVALID_PURCHASE_FORMAT);
  }
};
