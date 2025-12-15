import { useQuery } from "@tanstack/react-query";
import { api, ServerError } from "@cjsantee/pondero-client";
import { wrapped } from "./queryKeys";
import { useSession } from "@cjsantee/pondero-client";
import { CowboyId } from "../../types";

export interface Wrapped {
  states: {
    state: string;
    latitude: number;
    longitude: number;
  }[],
  horses: {
    photo_url: string;
    score_date: string;
    cowboys: {
      cowboy_id: CowboyId;
      nickname: string;
    }[]
  }[],
  drinks: {
    photo_url: string;
    score_date: string;
    cowboys: {
      cowboy_id: CowboyId;
      nickname: string;
    }[]
  }[],
}
export default function useWrapped() {
  const { access_token, loading } = useSession();
  return useQuery({
    queryKey: wrapped,
    queryFn: async () => {
      const { success, error, data } = await api.get<{ wrapped: Wrapped }>("/public/cowboys/wrapped", { access_token });
      if (success && data) {
        const { wrapped } = data;
        return wrapped;
      }
      throw new ServerError(error);
    },
    enabled: !loading,
  });
}