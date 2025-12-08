export const loadDefaultTemplate = (type) => {
  if (type === 'system1') {
    return `
    # ROLE & IDENTITY
You are a professional cryptocurrency trader  operating in live markets on the bitget decentralized exchange.
You may hold multiple positions, including both long and short, as long as sufficient USDT is available, and you may provide multiple trades in a single response.
Before suggesting new trades, review the historical position records. Consider the profit or loss of each position and the reasons for losses. Reflect on patterns, mistakes, or risk exposure, and adjust your next trades accordingly.
Avoid overtrading and high-frequency short-term trades. Only open or adjust positions when there is a clear edge, and maintain disciplined risk management.
Each interaction has a ** 2–3 minute delay**, so avoid overtrading and short-term scalping. Focus on high-quality, data-driven entries with clear risk control.
When in profit,you can use tpsl to adjust stop-loss or take-profit and lock in gains while keeping upside potential.
Focus on **medium- to long-term trades** with strong data confirmation and clear risk management.
Follow the dominant market trend whenever possible.
It is not recommended to open long positions when the overall trend is clearly bearish, or to open short positions when the market is strongly bullish.
Trend-following trades are generally preferred over counter-trend attempts.
Your mission: Maximize risk-adjusted returns (PnL) through systematic, disciplined trading.
    `;
  } else if (type === 'system2') {
    return `# ROLE & IDENTITY
    作为一名资深的数字货币交易顾问，你需要根据当前的市场行情和用户的风险偏好，提供个性化的交易建议。请结合技术分析和基本面分析，帮助用户制定出切实可行的交易计划，并解释你的建议背后的逻辑和理由。`;
  }
};

export const termIntervalList = () => [
  {
    name: '1分钟',
    value: '1m'
  },
  {
    name: '3分钟',
    value: '3m'
  },
  {
    name: '5分钟',
    value: '5m'
  },
  {
    name: '15分钟',
    value: '15m'
  },
  {
    name: '30分钟',
    value: '30m'
  },
  {
    name: '1小时',
    value: '1H'
  },
  {
    name: '4小时',
    value: '4H'
  },
  {
    name: '6小时',
    value: '6H'
  },
  {
    name: '12小时',
    value: '12H'
  },
  {
    name: '1天',
    value: '1D'
  },
  {
    name: '3天',
    value: '3D'
  },
  {
    name: '1周',
    value: '1W'
  }
  // {
  //   name:'1月',
  //   value:'1M'
  // }
];
export function intervalToMinutes(interval) {
  const num = parseInt(interval); // 提取数字部分
  const unit = interval.replace(num, '').toUpperCase(); // 统一成大写

  switch (unit) {
    case 'M': // 1m, 3m, 5m
      return num;

    case 'H': // 1H, 4H, 6H...
      return num * 60;

    case 'D': // 1D, 3D
      return num * 60 * 24;

    case 'W': // 1W
      return num * 60 * 24 * 7;

    default:
      throw new Error('不支持的周期格式: ' + interval);
  }
}

export function isLongTermGreater(shortTerm, longTerm) {
  console.log('shortTerm:', shortTerm, 'longTerm:', longTerm);
  if (!shortTerm || !longTerm) return false;

  const shortVal = intervalToMinutes(shortTerm);
  const longVal = intervalToMinutes(longTerm);

  return longVal > shortVal;
}

export function isShortTermSmaller(shortTerm, longTerm) {
  console.log('shortTerm:', shortTerm, 'longTerm:', longTerm);
  if (!shortTerm || !longTerm) return false;

  const shortVal = intervalToMinutes(shortTerm);
  const longVal = intervalToMinutes(longTerm);

  return shortVal < longVal;
}
