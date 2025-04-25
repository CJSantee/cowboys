import { useQuery } from "@tanstack/react-query";
import { cowboyKeys } from "./queryKeys";
import { api, ServerError, useSession } from "@cjsantee/pondero-client";

interface UseCowboyParams {
  cowboy_id: number;
}

interface CowboyData {
  cowboy_id: number;
  first_name: string;
  last_name: string;
  nickname: string;
  points: number;
  photos: {
    photo_id: number;
    url: string;
  }[];
}

export default function useCowboy({ cowboy_id }:UseCowboyParams) {
  const { access_token } = useSession();

  return useQuery({
    queryKey: cowboyKeys.cowboy(cowboy_id),
    queryFn: async () => {
      const { success, error, data } = await api.get<{ cowboy: CowboyData }>(
        `/cowboys/${cowboy_id}`,
        {
          access_token,
        }
      );
      if(success) {
        return data.cowboy;
      }
      throw new ServerError(error);
    },
  });
}