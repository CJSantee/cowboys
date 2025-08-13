import { api, ServerError, useSession } from '@cjsantee/pondero-client';
import { useQuery } from '@tanstack/react-query';
import { charter } from './queryKeys';
import { CowboyId } from '../../types';

interface CowboyCharter {
  cowboy_charter_version_id: number;
  cowboys: { cowboy_id: CowboyId; name: string; user_id: number }[];
}

/**
 * Custom hook to fetch the cowboy charter assents.
 */
export default function useCharter() {
  const { access_token } = useSession();
  return useQuery({
    queryKey: charter,
    queryFn: async () => {
      const { success, error, data } = await api.get<{ charter: CowboyCharter }>(
        '/public/cowboys/charter',
        {
          access_token,
        }
      );
      if (success) {
        return data.charter;
      }
      throw new ServerError(error);
    },
    retry: false,
  });
}
