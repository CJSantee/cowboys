import { useQuery } from "@tanstack/react-query";
import { photoKeys } from "./queryKeys";
import { api } from "@cjsantee/pondero-client";

export default function usePhotos() {
  return useQuery({
    queryKey: photoKeys.all,
    queryFn: async () => {
      const { success, error, data } = await api.get<{
        photos: {
          url: string;
          cowboys: { cowboy_id: number; nickname: string }[];
        }[];
      }>("/cowboys/photos");
      if(success && data) {
        const { photos } = data;
        return photos;
      }
      // TODO: Replace with ServerError when exported by pondero-client
      throw new Error(error.message);
    },
  });
}