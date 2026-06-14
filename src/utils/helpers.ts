// 生成唯一 ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 格式化金额为显示字符串
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// 格式化数字(添加千位分隔符)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}
