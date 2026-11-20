import { useQuery } from '@tanstack/react-query';
import { photoKeys } from './queryKeys';
import useSession from '../useSession';
import { CowboyId } from '../../types';
import { getJson } from '../../utils/api';

export default function usePhotos() {
  const { loading } = useSession();
  return useQuery({
    queryKey: photoKeys.all,
    queryFn: async () => {
      const { photos } = await getJson<{
        photos: {
          photo_id: number;
          photo_url: string;
          cowboys: { cowboy_id: CowboyId; nickname: string; points: number }[];
          score_date: string;
          is_public: boolean;
        }[];
      }>('/cowboys/photos');
      return photos;
    },
    enabled: !loading,
  });
}
