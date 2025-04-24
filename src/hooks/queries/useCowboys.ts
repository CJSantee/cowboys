import { useQuery } from "@tanstack/react-query";
import { cowboyKeys } from "./queryKeys";
import { api, useSession } from "@cjsantee/pondero-client";

export default function useCowboys() {
  const { access_token } = useSession();
  return useQuery({
    queryKey: cowboyKeys.all,
    queryFn: async () => {
      const { success, error, data } = await api.get<{
        cowboys: { cowboy_id: number; nickname: string }[];
      }>("/cowboys", { access_token });
      if (success && data) {
        const { cowboys } = data;
        return cowboys;
      }
      // TODO: Replace with ServerError when exported by pondero-client
      throw new Error(error.message);
    },
  });
}
