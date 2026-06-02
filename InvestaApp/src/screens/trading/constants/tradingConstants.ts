// Trading Enums
export const TRADING_CATEGORIES = {
  NIFTY_50: 'Nifty 50',
  SECTORS: 'Sectors',
  FAVORITES: 'Favorites',
} as const;

export const ORDER_TYPES = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
  STOP_LOSS: 'STOP_LOSS',
} as const;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
} as const;

export const TRADE_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

export const TIME_FRAMES = {
  DAY: '1D',
  WEEK: '1W',
  MONTH: '1M',
  QUARTER: '3M',
  YEAR: '1Y',
} as const;

export const CHART_TYPES = {
  LINE: 'LINE',
  CANDLESTICK: 'CANDLESTICK',
  BAR: 'BAR',
} as const;
