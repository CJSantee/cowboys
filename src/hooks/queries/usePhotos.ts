import { useQuery } from '@tanstack/react-query';
import { photoKeys } from './queryKeys';
import { api, useSession, ServerError } from '@cjsantee/pondero-client';
import { CowboyId } from '../../types';

export default function usePhotos() {
  const { access_token, loading } = useSession();
  return useQuery({
    queryKey: photoKeys.all,
    queryFn: async () => {
      const { success, error, data } = await api.get<{
        photos: {
          photo_id: number;
          photo_url: string;
          cowboys: { cowboy_id: CowboyId; nickname: string; points: number }[];
          score_date: string;
          is_public: boolean;
        }[];
      }>('/public/cowboys/photos', { access_token });
      if (success && data) {
        const { photos } = data;
        return photos;
      }
      throw new ServerError(error);
    },
    enabled: !loading,
  });
}
