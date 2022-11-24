// 处理 value 为0的情况，0作为 value 不应该被 delete
export const isFalsy = (value) => (value === 0 ? false : !value);

// 清理空值(避免修改原对象)
export const cleanObject = (object) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isFalsy(value)) {
      delete result[key];
    }
  });
  return result;
};
