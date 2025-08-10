import { useQuery } from '@tanstack/react-query';
import { leaderboard } from './queryKeys';
import { api, ServerError, useSession } from '@cjsantee/pondero-client';
import { CowboyId } from '../../types';

export default function useLeaderboard() {
  const { access_token } = useSession();

  return useQuery({
    queryKey: leaderboard,
    queryFn: async () => {
      const { data, success, error } = await api.get<{
        leaderboard: {
          cowboy_id: CowboyId;
          nickname: string;
          points: number;
        }[];
      }>('/public/cowboys/leaderboard', {
        access_token,
      });
      if (success) {
        return data.leaderboard;
      }
      throw new ServerError(error);
    },
  });
}
