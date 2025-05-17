import { Decimal } from 'decimal.js';
import { trimTrailingZeros } from '@/api/tool/utils';
export type PositionSide = 'long' | 'short';

/**
 * 计算资金费收益
 * @param positionValue 持仓金额（单位：USDT）
 * @param fundingRate 资金费率（可以是百分数 -0.25 或小数 -0.0025）
 * @param side 持仓方向：'long' 表示做多，'short' 表示做空
 * @returns 收益为正，亏损为负，单位：USDT
 */
export function calculateFundingIncome(positionValue: number, fundingRate: number, side: PositionSide): number {
  // 百分比输入自动转小数
  const rate = Math.abs(fundingRate / 100);

  // 多仓收益 = 持仓金额 × 资金费率
  // 空仓收益 = 持仓金额 × -资金费率
  if (fundingRate < 0) {
    //负数是空头给多头
    let income = 0;
    if (side === 'long') {
      income = positionValue * rate;
    }
    if (side === 'short') {
      income = positionValue * -rate;
    }
    return Number(income.toFixed(6));
  }
  if (fundingRate > 0) {
    //正数是多头给空头
    let income = 0;
    if (side === 'long') {
      income = positionValue * -rate;
    }
    if (side === 'short') {
      income = positionValue * rate;
    }

    return Number(income.toFixed(6));
  }
}

/**
 * 使用 decimal.js 精度库估算强平价格（简化版：不含维持保证金率）
 * @param entryPrice 开仓价（如 30000）
 * @param leverage 杠杆倍数（如 10）
 * @param quantity 持仓数量（如 1 BTC）
 * @param side 持仓方向（"long" | "short"）
 * @returns 强平价格（字符串，保留 2 位小数）
 */
export function estimateLiquidationPriceDecimal(
  entryPrice: number | string,
  leverage: number | string,
  quantity: number | string,
  side: 'long' | 'short'
): string {
  const price = new Decimal(entryPrice);
  const lev = new Decimal(leverage);
  const qty = new Decimal(quantity);

  if (lev.lte(0) || price.lte(0) || qty.lte(0)) {
    console.warn("参数必须为正数");
    // throw new Error('参数必须为正数');
    return '-';
  }

  // 保证金 = 仓位价值 / 杠杆
  const margin = price.mul(qty).div(lev);

  const liquidationPrice =
    side === 'long'
      ? price.sub(margin.div(qty)) // 多头强平线
      : price.add(margin.div(qty)); // 空头强平线

  return liquidationPrice.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString();
}
function isValidNumber(value) {
  const num = Number(value);
  return typeof value === 'string' && value.trim() !== '' && Number.isFinite(num);
}
/**
 * 计算预估价相对于当前价的涨跌幅百分比
 * @param currentPrice 当前价格
 * @param estimatedPrice 预估价格
 * @returns 涨跌百分比（字符串，保留2位小数，带正负号）
 */
export function calculatePriceChangePercent(
  currentPrice: number | string,
  estimatedPrice: number | string
): string {
  console.log("--------------->  calculatePriceChangePercent()"+currentPrice+" - "+estimatedPrice);
  if (!currentPrice || !estimatedPrice) {
    return '-%';
  }

  if (!isValidNumber(currentPrice)|| !isValidNumber(estimatedPrice)) {
    return '-%';
  }
  const current = new Decimal(currentPrice);
  const estimate = new Decimal(estimatedPrice);

  if (current.lte(0)) {
    // throw new Error('当前价格必须为正数');
    return '-%'
  }

  // 涨跌百分比 = (预估价 - 当前价) / 当前价 × 100
  const percent = estimate.sub(current).div(current).mul(100);
  const formatted = percent.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // 显式添加正负号
  return `${formatted.greaterThanOrEqualTo(0) ? '+' : ''}${formatted.toString()}%`;
}


/**
 * 将数字保留指定的小数位数（默认四舍五入）
 * @param value 原始数字或字符串
 * @param decimalPlaces 要保留的小数位数，默认 4
 * @returns 保留指定小数位的字符串
 */
export function formatToDecimal(value: number | string, decimalPlaces = 4): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num == null) return Number(0).toFixed(decimalPlaces);
  return num.toFixed(decimalPlaces);
}

/**
 * 计算最低保证金
 * @param size
 * @param leverage
 */
// 封装计算最低保证金的函数
export function calculateMargin(size: number, price: number, leverage: number): string {
  const sizeDecimal = new Decimal(size);    // 开仓数量
  const priceDecimal = new Decimal(price);  // 当前价格（USDT）
  const leverageDecimal = new Decimal(leverage); // 杠杆倍数

  // 计算最低保证金
  const margin = sizeDecimal.mul(priceDecimal).div(leverageDecimal);

  // 返回保证金，保留 10 位小数
  return trimTrailingZeros(margin.toFixed(10));
}

/**
 * 计算年化收益率（基于单利，不考虑复投）
 *
 * @param principal 总投资金额（P）
 * @param interest 每次获得的利息金额（r）
 * @param interval 每隔多少小时获得一次利息（N）
 * @returns 年化收益率（小数，如 0.45 表示 45%）
 */
export function calcAnnualizedReturnSimple(principal: number, interest: number, interval: number): number {
  if (principal <= 0 || interval <= 0) {
    throw new Error('本金和间隔时间必须大于 0');
  }

  const periodsPerYear = (365 * 24) / interval;
  const totalInterestPerYear = interest * periodsPerYear;

  const annualized = totalInterestPerYear / principal;
  return annualized;
}

export function formatColumn(label: string, prop: string) {
  return {
    label,
    prop,
    formatter: (_row: any, _col: any, val: any) => (val === null || val === undefined || val === '' ? '--' : val)
  };
}
