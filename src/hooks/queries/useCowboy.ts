import { useQuery } from '@tanstack/react-query';
import { cowboyKeys } from './queryKeys';
import { api, ServerError, useSession } from '@cjsantee/pondero-client';
import { CowboyId } from '../../types';

export interface CowboyData {
  cowboy_id: CowboyId;
  first_name: string;
  last_name: string;
  nickname: string;
  points: number;
  photos: {
    photo_id: number;
    photo_url: string;
    score_date: string;
    points: number;
  }[];
}

/**
 * Custom hook to fetch a cowboy's data.
 * @param cowboy_identifier - Either the cowboy's ID or nickname.
 */
export default function useCowboy(cowboy_identifier: CowboyId | string) {
  const { access_token } = useSession();
  return useQuery({
    queryKey: cowboyKeys.cowboy(cowboy_identifier),
    queryFn: async () => {
      const { success, error, data } = await api.get<{ cowboy: CowboyData }>(
        `/cowboys/${cowboy_identifier}`,
        {
          access_token,
        }
      );
      if (success) {
        return data.cowboy;
      }
      throw new ServerError(error);
    },
  });
}
