// 金额取整方式类型
export type RoundingMethod = 'round' | 'ceil' | 'floor';

// 取整函数 - 默认四舍五入到整数
export function roundPrice(amount: number, method: RoundingMethod = 'round'): number {
  // 内部计算保留两位小数
  const rounded = Math.round(amount * 100) / 100;

  // 页面显示四舍五入到整数(默认行为)
  switch (method) {
    case 'ceil':
      return Math.ceil(rounded);
    case 'floor':
      return Math.floor(rounded);
    case 'round':
    default:
      return Math.round(rounded);
  }
}

// 用于内部计算,保留两位小数
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

// 分转元
export function fromCents(cents: number): number {
  return cents / 100;
}

// 确保金额不为负数
export function clampToZero(amount: number): number {
  return Math.max(0, amount);
}
