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

export const LEADERBOARD_DATA = [
  { rank: 1, username: '@trader_pro', totalValue: '985,420', totalReturn: '+156.3%' },
  { rank: 2, username: '@stock_guru', totalValue: '724,150', totalReturn: '+112.8%' },
  { rank: 3, username: '@investa_king', totalValue: '512,380', totalReturn: '+89.2%' },
  { rank: 4, username: '@market_wiz', totalValue: '423,750', totalReturn: '+67.5%' },
  { rank: 5, username: '@bull_rider', totalValue: '356,290', totalReturn: '+54.1%' },
  { rank: 6, username: '@value_hunter', totalValue: '298,640', totalReturn: '+48.3%' },
  { rank: 7, username: '@dividend_queen', totalValue: '267,810', totalReturn: '+42.7%' },
  { rank: 8, username: '@swing_trader', totalValue: '234,560', totalReturn: '+38.9%' },
  { rank: 9, username: '@option_player', totalValue: '198,430', totalReturn: '+32.4%' },
  { rank: 10, username: '@day_trader', totalValue: '176,520', totalReturn: '+28.6%' },
  { rank: 47, username: '@traderpro_alex', totalValue: '125,840', totalReturn: '+24.8%', isCurrentUser: true },
];
