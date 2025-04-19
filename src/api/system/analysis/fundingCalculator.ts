
export type PositionSide = 'long' | 'short';

/**
 * 计算资金费收益
 * @param positionValue 持仓金额（单位：USDT）
 * @param fundingRate 资金费率（可以是百分数 -0.25 或小数 -0.0025）
 * @param side 持仓方向：'long' 表示做多，'short' 表示做空
 * @returns 收益为正，亏损为负，单位：USDT
 */
export function calculateFundingIncome(
  positionValue: number,
  fundingRate: number,
  side: PositionSide
): number {
  // 百分比输入自动转小数
  const rate = Math.abs(fundingRate /100);

  // 多仓收益 = 持仓金额 × 资金费率
  // 空仓收益 = 持仓金额 × -资金费率
  if (fundingRate < 0) {
    //负数是空头给多头
    let income = 0;
    if(side === 'long'){
      income = positionValue * rate;
    }
    if(side === 'short'){
      income = positionValue * -rate;
    }
    return Number(income.toFixed(6));
  }
  if (fundingRate > 0) {
    //正数是多头给空头
    let income = 0;
    if(side === 'long'){
      income = positionValue * -rate;
    }
    if(side === 'short'){
      income = positionValue * rate;
    }

    return Number(income.toFixed(6));
  }

}

/**
 * 将数字保留指定的小数位数（默认四舍五入）
 * @param value 原始数字或字符串
 * @param decimalPlaces 要保留的小数位数，默认 4
 * @returns 保留指定小数位的字符串
 */
export function formatToDecimal(value: number | string, decimalPlaces = 4): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return Number(0).toFixed(decimalPlaces);
  return num.toFixed(decimalPlaces);
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
    throw new Error("本金和间隔时间必须大于 0");
  }

  const periodsPerYear = (365 * 24) / interval;
  const totalInterestPerYear = interest * periodsPerYear;

  const annualized = totalInterestPerYear / principal;
  return annualized;
}
