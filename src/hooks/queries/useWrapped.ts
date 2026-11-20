import { useQuery } from "@tanstack/react-query";
import { wrapped } from "./queryKeys";
import useSession from "../useSession";
import { CowboyId } from "../../types";
import { getJson } from "../../utils/api";

export type Activity = 'skydiving' | 'rockies' | 'bull' | 'eagle' | 'love' | 'speak';

export interface Wrapped {
  states: {
    state: string;
    name: string;
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
  llywd: {
    [key in Activity]: {
      photo_url: string;
      score_date: string;
      cowboys: {
        cowboy_id: CowboyId;
        nickname: string;
      }[]
    }[]
  },
  score_days: {
    score_date: string;
    week: string;
    num_cowboys: number;
  }[]
}
export default function useWrapped() {
  const { loading } = useSession();
  return useQuery({
    queryKey: wrapped,
    queryFn: async () => {
      const { wrapped } = await getJson<{ wrapped: Wrapped }>('/cowboys/wrapped');
      return wrapped;
    },
    enabled: !loading,
  });
}