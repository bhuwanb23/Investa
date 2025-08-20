import { useMemo } from 'react';

type LeaderboardUser = {
  rank: number;
  username: string;
  totalValue: string;
  totalReturn: string;
  isCurrentUser?: boolean;
};

type Highlight = { label: string; value: string; color: string };

export default function useLeaderboardData(raw: LeaderboardUser[]) {
  const { currentUser, topUsers, highlights } = useMemo(() => {
    const current = raw.find(u => u.isCurrentUser) || {
      rank: 47,
      username: '@traderpro_alex',
      totalValue: '125,840',
      totalReturn: '24.8%',
    };

    const others = raw.filter(u => !u.isCurrentUser).slice(0, 12);

    const hl: Highlight[] = [
      { label: 'Top Gainer', value: '+12.4%', color: '#10B981' },
      { label: 'Most Trades', value: '1,245', color: '#3B82F6' },
      { label: 'Consistency', value: '92%', color: '#F59E0B' },
    ];

    return { currentUser: current, topUsers: others, highlights: hl };
  }, [raw]);

  return { currentUser, topUsers, highlights };
}


