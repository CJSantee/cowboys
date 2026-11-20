import { useQuery } from '@tanstack/react-query';
import { charter } from './queryKeys';
import { CowboyId } from '../../types';
import { getJson } from '../../utils/api';

interface CowboyCharter {
  cowboy_charter_version_id: number;
  cowboys: { cowboy_id: CowboyId; name: string; user_id: number }[];
}

/**
 * Custom hook to fetch the cowboy charter assents.
 */
export default function useCharter() {
  return useQuery({
    queryKey: charter,
    queryFn: async () => {
      const { charter } = await getJson<{ charter: CowboyCharter }>('/cowboys/charter');
      return charter;
    },
    retry: false,
  });
}
