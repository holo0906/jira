import { useEffect, useState } from "react";

// 处理 value 为0的情况，0作为 value 不应该被 delete
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

// 清理空值(避免修改原对象)
export const cleanObject = (object: object) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    // @ts-ignore
    const value = result[key];
    if (isFalsy(value)) {
      // @ts-ignore
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};

// delay?: number 表示该参数可以不传，要么就传 number
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // 每次 value 变化后设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次上一个 useEffect 执行完之后清空定时器
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};

export const useArray = <T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray);
  return {
    value,
    setValue,
    add: (item: T) => setValue([...value, item]),
    clear: () => setValue([]),
    removeIndex: (index: number) => {
      const copy = [...value];
      copy.splice(index, 1);
      setValue(copy);
    },
  };
};
