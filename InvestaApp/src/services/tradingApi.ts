import { api } from './api';

// Types for trading data
export interface Stock {
  id: number;
  symbol: string;
  name: string;
  exchange: string;
  sector?: string;
  industry?: string;
  market_cap?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockPrice {
  id: number;
  stock: number;
  stock_symbol: string;
  stock_name: string;
  date: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  created_at: string;
}

export interface MarketData {
  id: number;
  stock: number;
  stock_symbol: string;
  stock_name: string;
  current_price: number;
  change_amount: number;
  change_percentage: number;
  volume: number;
  high_24h: number;
  low_24h: number;
  open_24h: number;
  previous_close: number;
  market_cap?: number;
  pe_ratio?: number;
  dividend_yield?: number;
  updated_at: string;
}

export interface TechnicalIndicator {
  id: number;
  stock: number;
  stock_symbol: string;
  indicator_name: string;
  value: number;
  signal: string;
  period?: number;
  updated_at: string;
}

export interface StockDetail extends Stock {
  market_data?: MarketData;
  technical_indicators: TechnicalIndicator[];
  is_in_watchlist: boolean;
}

export interface Portfolio {
  id: number;
  user: number;
  total_value: number;
  total_invested: number;
  total_profit_loss: number;
  cash_balance: number;
  created_at: string;
  updated_at: string;
  total_return_percentage: number;
  holdings_count: number;
  top_holdings: PortfolioHolding[];
}

export interface PortfolioHolding {
  id: number;
  portfolio: number;
  stock: Stock;
  quantity: number;
  average_price: number;
  total_invested: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  created_at: string;
  updated_at: string;
  return_percentage: number;
}

export interface Order {
  id: number;
  user: number;
  stock: Stock;
  order_type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  side: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
  stop_price?: number;
  filled_quantity: number;
  average_fill_price?: number;
  status: 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'REJECTED';
  total_amount?: number;
  commission: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  filled_at?: string;
  is_completed: boolean;
  remaining_quantity: number;
}

export interface Trade {
  id: number;
  order: number;
  user: number;
  stock: Stock;
  quantity: number;
  price: number;
  side: 'BUY' | 'SELL';
  total_amount: number;
  commission: number;
  net_amount: number;
  executed_at: string;
}

export interface TradingPerformance {
  id: number;
  user: number;
  portfolio_value: number;
  portfolio_growth_percentage: number;
  total_trades: number;
  successful_trades: number;
  total_profit_loss: number;
  best_trade_profit: number;
  worst_trade_loss: number;
  total_commission_paid: number;
  average_trade_size: number;
  largest_position: number;
  created_at: string;
  updated_at: string;
  success_rate: number;
  average_return_per_trade: number;
}

export interface UserWatchlist {
  id: number;
  user: number;
  stock: Stock;
  added_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  achievement_type: string;
  icon_name: string;
  color: string;
  criteria_value?: number;
  created_at: string;
}

export interface UserAchievement {
  id: number;
  user: number;
  achievement: Achievement;
  earned_at: string;
}

export interface LeaderboardEntry {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  portfolio_value: number;
  portfolio_growth_percentage: number;
  total_trades: number;
  successful_trades: number;
  success_rate: number;
  rank: number;
}

export interface MarketSummary {
  total_stocks: number;
  advancing: number;
  declining: number;
  unchanged: number;
  total_volume: number;
}

export interface TopMovers {
  top_gainers: MarketData[];
  top_losers: MarketData[];
}

export interface TradeSummary {
  total_trades: number;
  buy_trades: number;
  sell_trades: number;
  total_volume: number;
  total_amount: number;
  average_trade_size: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Trading API service
class TradingApiService {
  // Stock endpoints
  async getStocks(search?: string, ordering?: string): Promise<Stock[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (ordering) params.append('ordering', ordering);
    
    const response = await api.get(`/stocks/${params.toString() ? '?' + params.toString() : ''}`);
    return response.data;
  }

  async getStock(symbol: string): Promise<StockDetail> {
    const response = await api.get(`/stocks/${symbol}/`);
    return response.data;
  }

  async getStockMarketData(symbol: string): Promise<MarketData> {
    const response = await api.get(`/stocks/${symbol}/market_data/`);
    return response.data;
  }

  async getStockTechnicalIndicators(symbol: string): Promise<TechnicalIndicator[]> {
    const response = await api.get(`/stocks/${symbol}/technical_indicators/`);
    return response.data;
  }

  async getStockPriceHistory(symbol: string, days: number = 30): Promise<StockPrice[]> {
    const response = await api.get(`/stocks/${symbol}/price_history/?days=${days}`);
    return response.data;
  }

  // Watchlist endpoints
  async getMyWatchlist(): Promise<StockDetail[]> {
    const response = await api.get('/watchlist/my_watchlist/');
    return response.data;
  }

  async addToWatchlist(stockId: number): Promise<UserWatchlist> {
    const response = await api.post('/watchlist/add_stock/', { stock_id: stockId });
    return response.data;
  }

  async removeFromWatchlist(watchlistId: number): Promise<void> {
    await api.delete(`/watchlist/${watchlistId}/`);
  }

  // Portfolio endpoints
  async getMyPortfolio(): Promise<Portfolio> {
    const response = await api.get('/portfolio/my_portfolio/');
    return response.data;
  }

  async getPortfolioHoldings(): Promise<PortfolioHolding[]> {
    const response = await api.get('/portfolio/holdings/');
    return response.data.holdings;
  }

  // Order endpoints
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const response = await api.post('/orders/', orderData);
    return response.data;
  }

  async getOrders(status?: string, side?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (side) params.append('side', side);
    
    const response = await api.get(`/orders/order_history/${params.toString() ? '?' + params.toString() : ''}`);
    return response.data;
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const response = await api.post(`/orders/${orderId}/cancel_order/`);
    return response.data;
  }

  // Trade endpoints
  async getTrades(): Promise<Trade[]> {
    const response = await api.get('/trades/');
    return response.data;
  }

  async getTradeSummary(): Promise<TradeSummary> {
    const response = await api.get('/trades/trade_summary/');
    return response.data;
  }

  // Trading Performance endpoints
  async getMyPerformance(): Promise<TradingPerformance> {
    const response = await api.get('/trading-performance/my_performance/');
    return response.data;
  }

  async getLeaderboard(timeframe: string = 'all'): Promise<LeaderboardEntry[]> {
    const response = await api.get(`/trading-performance/leaderboard/?timeframe=${timeframe}`);
    return response.data;
  }

  // Market Data endpoints
  async getTopMovers(): Promise<TopMovers> {
    const response = await api.get('/market-data/top_movers/');
    return response.data;
  }

  async getMarketSummary(): Promise<MarketSummary> {
    const response = await api.get('/market-data/market_summary/');
    return response.data;
  }

  // Achievement endpoints
  async getMyAchievements(): Promise<UserAchievement[]> {
    const response = await api.get('/achievements/my_achievements/');
    return response.data;
  }

  async getAvailableAchievements(): Promise<Achievement[]> {
    const response = await api.get('/achievements/available_achievements/');
    return response.data;
  }

  // Utility methods for frontend
  async searchStocks(query: string): Promise<Stock[]> {
    return this.getStocks(query);
  }

  async getStocksByCategory(category: string): Promise<Stock[]> {
    // This would map to backend filtering
    const stocks = await this.getStocks();
    if (category === 'All') return stocks;
    if (category === 'Favorites') {
      const watchlist = await this.getMyWatchlist();
      return watchlist.map(item => item.stock);
    }
    // Add more category logic as needed
    return stocks;
  }

  async getStockBySymbol(symbol: string): Promise<StockDetail | null> {
    try {
      return await this.getStock(symbol);
    } catch (error) {
      console.error(`Error fetching stock ${symbol}:`, error);
      return null;
    }
  }

  async toggleFavorite(stockId: number): Promise<boolean> {
    try {
      const watchlist = await this.getMyWatchlist();
      const isInWatchlist = watchlist.some(item => item.stock.id === stockId);
      
      if (isInWatchlist) {
        const watchlistItem = watchlist.find(item => item.stock.id === stockId);
        if (watchlistItem) {
          await this.removeFromWatchlist(watchlistItem.id);
        }
        return false;
      } else {
        await this.addToWatchlist(stockId);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }

  async placeOrder(side: 'BUY' | 'SELL', stockId: number, quantity: number, 
                   orderType: 'MARKET' | 'LIMIT' = 'MARKET', price?: number): Promise<Order> {
    const orderData = {
      stock_id: stockId,
      side,
      quantity,
      order_type: orderType,
      price: orderType === 'LIMIT' ? price : undefined,
    };

    return await this.createOrder(orderData);
  }

  async getPortfolioSummary(): Promise<Portfolio> {
    return await this.getMyPortfolio();
  }

  async getOrderHistory(filters?: { status?: string; side?: string }): Promise<Order[]> {
    return await this.getOrders(filters?.status, filters?.side);
  }

  async getTradingStats(): Promise<TradeSummary> {
    return await this.getTradeSummary();
  }

  async getLeaderboardData(timeframe: string = 'all'): Promise<LeaderboardEntry[]> {
    return await this.getLeaderboard(timeframe);
  }

  async getMarketOverview(): Promise<{ topMovers: TopMovers; summary: MarketSummary }> {
    const [topMovers, summary] = await Promise.all([
      this.getTopMovers(),
      this.getMarketSummary()
    ]);
    
    return { topMovers, summary };
  }
}

// Export singleton instance
const tradingApi = new TradingApiService();
export default tradingApi;

// Export types for use in other files
export type {
  Stock, StockPrice, MarketData, TechnicalIndicator, StockDetail,
  Portfolio, PortfolioHolding, Order, Trade, TradingPerformance,
  UserWatchlist, Achievement, UserAchievement, LeaderboardEntry,
  MarketSummary, TopMovers, TradeSummary
};
