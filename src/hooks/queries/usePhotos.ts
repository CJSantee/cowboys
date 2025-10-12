import { useQuery } from '@tanstack/react-query';
import { photoKeys } from './queryKeys';
import { api, useSession } from '@cjsantee/pondero-client';
import { CowboyId } from '../../types';

export default function usePhotos() {
  const { access_token } = useSession();
  return useQuery({
    queryKey: photoKeys.all,
    queryFn: async () => {
      const { success, error, data } = await api.get<{
        photos: {
          url: string;
          cowboys: { cowboy_id: CowboyId; nickname: string; points: number }[];
          alt_photos: { url: string; metadata: { env?: string; quality: number } }[];
          score_date: string;
        }[];
      }>('/cowboys/photos', { access_token });
      if (success && data) {
        const { photos } = data;
        return photos;
      }
      // TODO: Replace with ServerError when exported by pondero-client
      throw new Error(error.message);
    },
  });
}
