// utils/formatNumber.ts
export function formatPrettyNumber(num: number, lang: 'zh' | 'en' = 'zh', digits = 2): string {
  if (lang === 'zh') {
    if (num >= 1e8) return (num / 1e8).toFixed(digits) + '亿';
    if (num >= 1e4) return (num / 1e4).toFixed(digits) + '万';
    return num.toString();
  } else {
    if (num >= 1e9) return (num / 1e9).toFixed(digits) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(digits) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(digits) + 'K';
    return num.toString();
  }
}
