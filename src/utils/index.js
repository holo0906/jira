import { useEffect, useState } from "react";

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

export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []);
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // 每次 value 变化后设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次上一个 useEffect 执行完之后清空定时器
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};
