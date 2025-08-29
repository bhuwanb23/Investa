import { useState, useEffect, useCallback } from 'react';
import { PORTFOLIO_DATA, PORTFOLIO_HOLDINGS, ORDER_HISTORY } from '../constants/tradingConstants';
import { fetchStocks } from '../utils/tradingApi';

export interface Stock {
  id?: number;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changeValue: string;
  isPositive: boolean;
  exchange: string;
  isFavorite: boolean;
  volume: string;
  marketCap: string;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: string;
  currentPrice: string;
  marketValue: string;
  profit: string;
  profitPercentage: string;
  isPositive: boolean;
}

export interface OrderHistoryItem {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: string;
  total: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  date: string;
  time: string;
  profit: string;
  profitPercentage: string;
  isPositive: boolean;
}

export const useTradingData = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolioData, setPortfolioData] = useState(PORTFOLIO_DATA);
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>(PORTFOLIO_HOLDINGS);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>(ORDER_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Nifty 50');
  const [isLoading, setIsLoading] = useState(false);

  // Filter stocks based on search query
  const filteredStocks = useCallback(() => {
    if (!searchQuery.trim()) {
      return stocks;
    }
    return stocks.filter(stock =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stocks, searchQuery]);

  // Filter stocks by category
  const getStocksByCategory = useCallback((category: string) => {
    switch (category) {
      case 'Favorites':
        return stocks.filter(stock => stock.isFavorite);
      case 'Sectors':
        // In a real app, you would filter by sector
        return stocks.slice(0, 5); // Return first 5 for demo
      default:
        return stocks;
    }
  }, [stocks]);

  // Toggle favorite status
  const toggleFavorite = useCallback((symbol: string) => {
    setStocks(prevStocks =>
      prevStocks.map(stock =>
        stock.symbol === symbol
          ? { ...stock, isFavorite: !stock.isFavorite }
          : stock
      )
    );
  }, []);

  // Initial load from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const list = await fetchStocks();
        if (!mounted) return;
        const mapped: Stock[] = list.map((s: any) => ({
          id: s.id,
          symbol: s.symbol,
          name: s.name,
          price: `₹${Number(s.market_cap ?? 0).toFixed(2)}`, // placeholder; real price comes from market-data endpoint
          change: '0.00%',
          changeValue: '0.00',
          isPositive: true,
          exchange: s.exchange || 'NSE',
          isFavorite: false,
          volume: '-',
          marketCap: s.market_cap != null ? `₹${s.market_cap}` : '-',
        }));
        setStocks(mapped);
      } catch (e) {
        // swallow for now
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Search stocks
  const searchStocks = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Get stock by symbol
  const getStockBySymbol = useCallback((symbol: string) => {
    return stocks.find(stock => stock.symbol === symbol);
  }, [stocks]);

  // Get portfolio holding by symbol
  const getPortfolioHolding = useCallback((symbol: string) => {
    return portfolioHoldings.find(holding => holding.symbol === symbol);
  }, [portfolioHoldings]);

  // Add stock to portfolio (simulate buy order)
  const addToPortfolio = useCallback((symbol: string, quantity: number, price: number) => {
    const stock = getStockBySymbol(symbol);
    if (!stock) return;

    const existingHolding = getPortfolioHolding(symbol);
    const totalCost = quantity * price;

    if (existingHolding) {
      // Update existing holding
      const newQuantity = existingHolding.quantity + quantity;
      const newAvgPrice = ((existingHolding.quantity * parseFloat(existingHolding.avgPrice.replace('₹', ''))) + totalCost) / newQuantity;
      const currentPrice = parseFloat(stock.price.replace('₹', '').replace(',', ''));
      const marketValue = newQuantity * currentPrice;
      const profit = marketValue - (newQuantity * newAvgPrice);
      const profitPercentage = ((profit / (newQuantity * newAvgPrice)) * 100);

      setPortfolioHoldings(prev =>
        prev.map(holding =>
          holding.symbol === symbol
            ? {
                ...holding,
                quantity: newQuantity,
                avgPrice: `₹${newAvgPrice.toFixed(2)}`,
                currentPrice: stock.price,
                marketValue: `₹${marketValue.toFixed(0)}`,
                profit: `${profit >= 0 ? '+' : ''}₹${profit.toFixed(0)}`,
                profitPercentage: `${profit >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}%`,
                isPositive: profit >= 0,
              }
            : holding
        )
      );
    } else {
      // Add new holding
      const currentPrice = parseFloat(stock.price.replace('₹', '').replace(',', ''));
      const marketValue = quantity * currentPrice;
      const profit = marketValue - totalCost;
      const profitPercentage = ((profit / totalCost) * 100);

      const newHolding: PortfolioHolding = {
        symbol,
        name: stock.name,
        quantity,
        avgPrice: `₹${price.toFixed(2)}`,
        currentPrice: stock.price,
        marketValue: `₹${marketValue.toFixed(0)}`,
        profit: `${profit >= 0 ? '+' : ''}₹${profit.toFixed(0)}`,
        profitPercentage: `${profit >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}%`,
        isPositive: profit >= 0,
      };

      setPortfolioHoldings(prev => [...prev, newHolding]);
    }

    // Add to order history
    const newOrder: OrderHistoryItem = {
      id: Date.now().toString(),
      symbol,
      name: stock.name,
      type: 'BUY',
      quantity,
      price: `₹${price.toFixed(2)}`,
      total: `₹${totalCost.toFixed(2)}`,
      status: 'COMPLETED',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: true }),
      profit: '0',
      profitPercentage: '0%',
      isPositive: true,
    };

    setOrderHistory(prev => [newOrder, ...prev]);
  }, [getStockBySymbol, getPortfolioHolding]);

  // Remove stock from portfolio (simulate sell order)
  const removeFromPortfolio = useCallback((symbol: string, quantity: number, price: number) => {
    const existingHolding = getPortfolioHolding(symbol);
    if (!existingHolding || existingHolding.quantity < quantity) return;

    const stock = getStockBySymbol(symbol);
    if (!stock) return;

    const totalValue = quantity * price;
    const avgPrice = parseFloat(existingHolding.avgPrice.replace('₹', ''));
    const profit = totalValue - (quantity * avgPrice);
    const profitPercentage = ((profit / (quantity * avgPrice)) * 100);

    if (existingHolding.quantity === quantity) {
      // Remove entire holding
      setPortfolioHoldings(prev => prev.filter(holding => holding.symbol !== symbol));
    } else {
      // Update quantity
      const newQuantity = existingHolding.quantity - quantity;
      const currentPrice = parseFloat(stock.price.replace('₹', '').replace(',', ''));
      const marketValue = newQuantity * currentPrice;
      const remainingProfit = marketValue - (newQuantity * avgPrice);
      const remainingProfitPercentage = ((remainingProfit / (newQuantity * avgPrice)) * 100);

      setPortfolioHoldings(prev =>
        prev.map(holding =>
          holding.symbol === symbol
            ? {
                ...holding,
                quantity: newQuantity,
                marketValue: `₹${marketValue.toFixed(0)}`,
                profit: `${remainingProfit >= 0 ? '+' : ''}₹${remainingProfit.toFixed(0)}`,
                profitPercentage: `${remainingProfit >= 0 ? '+' : ''}${remainingProfitPercentage.toFixed(2)}%`,
                isPositive: remainingProfit >= 0,
              }
            : holding
        )
      );
    }

    // Add to order history
    const newOrder: OrderHistoryItem = {
      id: Date.now().toString(),
      symbol,
      name: stock.name,
      type: 'SELL',
      quantity,
      price: `₹${price.toFixed(2)}`,
      total: `₹${totalValue.toFixed(2)}`,
      status: 'COMPLETED',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: true }),
      profit: `${profit >= 0 ? '+' : ''}₹${profit.toFixed(0)}`,
      profitPercentage: `${profit >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}%`,
      isPositive: profit >= 0,
    };

    setOrderHistory(prev => [newOrder, ...prev]);
  }, [getStockBySymbol, getPortfolioHolding]);

  return {
    stocks: filteredStocks(),
    portfolioData,
    portfolioHoldings,
    orderHistory,
    searchQuery,
    selectedCategory,
    isLoading,
    searchStocks,
    toggleFavorite,
    getStockBySymbol,
    getPortfolioHolding,
    addToPortfolio,
    removeFromPortfolio,
    getStocksByCategory,
    setSelectedCategory,
  };
};
