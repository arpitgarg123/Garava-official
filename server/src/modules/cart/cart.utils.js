// small helpers
export const toPaise = (amount) => {
  if (typeof amount === "number" && Number.isInteger(amount)) return amount;
  const n = Number(amount);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
};

export const calcCartTotal = (items = []) => {
  return items.reduce((sum, it) => sum + (Number(it.unitPrice || 0) * Number(it.quantity || 0)), 0);
};
