import api from '../../../services/api';

// Stocks
export const fetchStocks = async () => {
	const res = await api.get('stocks/');
	return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
};

export const fetchStockDetail = async (stockId: number) => {
	const res = await api.get(`stocks/${stockId}/`);
	return res.data;
};

export const fetchStockMarketData = async (stockId: number) => {
	const res = await api.get(`stocks/${stockId}/market_data/`);
	return res.data;
};

export const fetchStockTechnicalIndicators = async (stockId: number) => {
	const res = await api.get(`stocks/${stockId}/technical_indicators/`);
	return res.data;
};

export const fetchStockPriceHistory = async (stockId: number, days = 30) => {
	const res = await api.get(`stocks/${stockId}/price_history/`, { params: { days } });
	return res.data;
};

// Watchlist
export const fetchMyWatchlist = async () => {
	const res = await api.get('watchlist/my_watchlist/');
	return res.data;
};

export const addToWatchlist = async (stockId: number) => {
	const res = await api.post('watchlist/add_stock/', { stock_id: stockId });
	return res.data;
};

// Portfolio
export const fetchMyPortfolio = async () => {
	const res = await api.get('portfolio/my_portfolio/');
	return res.data;
};

export const fetchPortfolioHoldings = async () => {
	const res = await api.get('portfolio/holdings/');
	return res.data?.holdings ?? [];
};

// Orders
export const fetchOrderHistory = async (params?: { status?: string; side?: string }) => {
	const res = await api.get('orders/', { params });
	return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
};

export const placeOrder = async (payload: {
	stock: number;
	side: 'BUY' | 'SELL';
	order_type?: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
	quantity: number;
	price?: number;
	stop_price?: number;
	notes?: string;
}) => {
	const res = await api.post('orders/', payload);
	return res.data;
};

export const cancelOrder = async (orderId: number) => {
	const res = await api.post(`orders/${orderId}/cancel_order/`, {});
	return res.data;
};

// Trades
export const fetchTrades = async () => {
	const res = await api.get('trades/');
	return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
};

export const fetchTradeSummary = async () => {
	const res = await api.get('trades/trade_summary/');
	return res.data;
};

// Performance
export const fetchMyPerformance = async () => {
	const res = await api.get('performance/my_performance/');
	return res.data;
};

export const fetchLeaderboard = async (timeframe: 'all' | 'weekly' | 'monthly' = 'all') => {
	const res = await api.get('performance/leaderboard/', { params: { timeframe } });
	return Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data);
};

// Market Data
export const fetchMarketTopMovers = async () => {
	const res = await api.get('market-data/top_movers/');
	return res.data;
};

export const fetchMarketSummary = async () => {
	const res = await api.get('market-data/market_summary/');
	return res.data;
};


