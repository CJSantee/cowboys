import { useQuery } from '@tanstack/react-query';
import { leaderboard } from './queryKeys';
import { api, ServerError, useSession } from '@cjsantee/pondero-client';
import { CowboyId } from '../../types';

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
  const { access_token } = useSession();

  return useQuery<{ leaderboard: LeaderboardEntry[]; timeline: TimelineEntry[] }>({
    queryKey: leaderboard,
    queryFn: async () => {
      const { data, success, error } = await api.get<{
        leaderboard: LeaderboardEntry[];
        timeline: TimelineEntry[];
      }>('/public/cowboys/leaderboard', {
        access_token,
      });
      if (success) {
        return data;
      }
      throw new ServerError(error);
    },
  });
}
