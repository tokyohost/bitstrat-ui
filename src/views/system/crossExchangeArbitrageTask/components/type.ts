interface ExchangeInfo {
  logo: string
  name: string
  position: string | number
  pnl: string | number
  entryPrice: string | number
  fundingRate: string | number
  latestPrice: string | number
}

interface Summary {
  createdAt: string
  runTime: string
  totalProfit: string | number
  profitRate: string | number
  annualProfit: string | number
  totalFundingRate: string | number
}
