import { useQuery } from '@tanstack/react-query';
import { cowboyKeys } from './queryKeys';
import { CowboyId } from '../../types';
import { getJson } from '../../utils/api';

export interface CowboyData {
  cowboy_id: CowboyId;
  first_name: string;
  last_name: string;
  nickname: string;
  points: number;
  is_public: boolean;
  photos: {
    photo_id: number;
    photo_url: string;
    score_date: string;
    points: number;
    alt_photos: {
      alt_photo_id: number;
      url: string;
      metadata: { env?: string; quality: number };
    }[];
  }[];
}

/**
 * Custom hook to fetch a cowboy's data.
 * @param cowboy_identifier - Either the cowboy's ID or nickname.
 */
export default function useCowboy(cowboy_identifier: CowboyId | string) {
  return useQuery({
    queryKey: cowboyKeys.cowboy(cowboy_identifier),
    queryFn: async () => {
      const { cowboy } = await getJson<{ cowboy: CowboyData }>(
        `/cowboys/${encodeURIComponent(cowboy_identifier)}`
      );
      return cowboy;
    },
    retry: false,
  });
}
