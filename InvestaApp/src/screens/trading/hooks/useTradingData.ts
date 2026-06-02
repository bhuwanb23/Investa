import { useState, useEffect, useCallback } from 'react';
import { fetchStocks, fetchMyWatchlist, addToWatchlist } from '../utils/tradingApi';

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

/**
 * Lightweight hook for stock lookup.
 * Provides: stocks list, search, get-by-symbol, watchlist toggle.
 * No portfolio/orders local mutation (use real API endpoints).
 */
export const useTradingData = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());

  // Load stocks + watchlist on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const [list, watch] = await Promise.all([
          fetchStocks(),
          fetchMyWatchlist().catch(() => []),
        ]);
        if (!mounted) return;
        const mapped: Stock[] = list.map((s: any) => ({
          id: s.id,
          symbol: s.symbol,
          name: s.name,
          price: s.current_price != null ? `₹${Number(s.current_price).toFixed(2)}` : '₹0.00',
          change: s.change_percentage != null ? `${s.change_percentage >= 0 ? '+' : ''}${Number(s.change_percentage).toFixed(2)}%` : '0.00%',
          changeValue: s.change_amount != null ? `${s.change_amount >= 0 ? '+' : ''}₹${Number(s.change_amount).toFixed(2)}` : '₹0.00',
          isPositive: s.change_percentage != null ? s.change_percentage >= 0 : true,
          exchange: s.exchange || 'NSE',
          isFavorite: false,
          volume: '-',
          marketCap: s.market_cap != null ? `₹${s.market_cap}` : '-',
        }));
        setStocks(mapped);
        const wIds = new Set<number>();
        const wList = Array.isArray(watch) ? watch : (watch?.results ?? []);
        wList.forEach((w: any) => {
          const stockId = w.stock?.id ?? w.stock_id;
          if (stockId) wIds.add(stockId);
        });
        setWatchlistIds(wIds);
        setStocks(prev => prev.map(s => (s.id && wIds.has(s.id) ? { ...s, isFavorite: true } : s)));
      } catch (e) {
        // swallow for now
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Search filter (client-side over the loaded list)
  const filteredStocks = useCallback(() => {
    if (!searchQuery.trim()) return stocks;
    const q = searchQuery.toLowerCase();
    return stocks.filter(s =>
      s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [stocks, searchQuery]);

  // Lookup by symbol
  const getStockBySymbol = useCallback((symbol: string) => {
    return stocks.find(s => s.symbol === symbol);
  }, [stocks]);

  // Toggle watchlist for a stock ID via real API
  const toggleFavorite = useCallback(async (stockId: number) => {
    const isInWatchlist = watchlistIds.has(stockId);
    try {
      if (isInWatchlist) {
        // Backend has no remove endpoint exposed; optimistically remove from set.
        // (full removal would require a watchlist ID; defer to Phase 3)
        setWatchlistIds(prev => {
          const next = new Set(prev);
          next.delete(stockId);
          return next;
        });
        setStocks(prev => prev.map(s => (s.id === stockId ? { ...s, isFavorite: false } : s)));
        return false;
      } else {
        await addToWatchlist(stockId);
        setWatchlistIds(prev => new Set(prev).add(stockId));
        setStocks(prev => prev.map(s => (s.id === stockId ? { ...s, isFavorite: true } : s)));
        return true;
      }
    } catch (e) {
      // revert on error
      return isInWatchlist;
    }
  }, [watchlistIds]);

  return {
    stocks: filteredStocks(),
    searchQuery,
    isLoading,
    searchStocks: setSearchQuery,
    getStockBySymbol,
    toggleFavorite,
  };
};
