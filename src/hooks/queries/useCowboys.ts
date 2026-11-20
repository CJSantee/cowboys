import { useQuery } from '@tanstack/react-query';
import { cowboyKeys } from './queryKeys';
import { CowboyId } from '../../types';
import { getJson } from '../../utils/api';

export interface Cowboy {
  cowboy_id: CowboyId;
  user_id: number;
  first_name: string;
  last_name: string;
  nickname: string;
  photo_url: string | null;
  is_public: boolean;
  num_photos: number;
  points: number;
}

export default function useCowboys() {
  return useQuery({
    queryKey: cowboyKeys.all,
    queryFn: async () => {
      const { cowboys } = await getJson<{ cowboys: Cowboy[] }>('/cowboys');
      return cowboys;
    },
  });
}
