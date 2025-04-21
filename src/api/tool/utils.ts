export function defaultFormatter(_row: any, _column: any, cellValue: any) {
  return cellValue === null || cellValue === undefined || cellValue === '' ? '-' : cellValue;
}

/**
 * 去除数字字符串末尾多余的0（保留有意义的小数）
 * @param input 数字或字符串
 * @returns 去除多余0后的字符串
 */
export function trimTrailingZeros(input: number | string): string {
  // 统一转成字符串处理
  const str = String(input);

  if (!str.includes('.')) return str; // 没有小数点直接返回

  // 去掉小数点后多余的 0，再去掉可能剩下的末尾小数点
  return str.replace(/\.?0+$/, '');
}

/**
 * 四舍五入保留指定小数位数
 * @param value 要处理的数字
 * @param decimals 保留的小数位数（默认 2）
 * @returns 四舍五入后的字符串结果（避免 JS 浮点精度问题）
 */
export function roundTo(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0';

  const factor = Math.pow(10, decimals);
  return (Math.round(num * factor) / factor).toFixed(decimals);
}
