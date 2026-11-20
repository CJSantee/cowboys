import { useQuery } from '@tanstack/react-query';
import { leaderboard } from './queryKeys';
import { CowboyId } from '../../types';
import { getJson } from '../../utils/api';

interface LeaderboardEntry {
  cowboy_id: CowboyId;
  nickname: string;
  points: number;
}

interface TimelineEntry {
  cowboy_id: CowboyId;
  nickname: string;
  points: {
    score_date: string;
    total_points: number;
  }[];
}

export default function useLeaderboard() {

  return useQuery<{ leaderboard: LeaderboardEntry[]; timeline: TimelineEntry[] }>({
    queryKey: leaderboard,
    queryFn: async () => {
      return getJson<{ leaderboard: LeaderboardEntry[]; timeline: TimelineEntry[] }>(
        '/cowboys/leaderboard'
      );
    },
  });
}
