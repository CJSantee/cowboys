import { useQuery } from "@tanstack/react-query";
import { cowboyKeys } from "./queryKeys";
import { api, ServerError, useSession } from "@cjsantee/pondero-client";
import { CowboyId } from "../../types";

export default function useCowboys() {
  const { access_token } = useSession();
  return useQuery({
    queryKey: cowboyKeys.all,
    queryFn: async () => {
      const { success, error, data } = await api.get<{
        cowboys: {
          cowboy_id: CowboyId;
          user_id: number;
          first_name: string;
          last_name: string;
          nickname: string;
        }[];
      }>("/cowboys", { access_token });
      if (success) {
        const { cowboys } = data;
        return cowboys;
      }
      throw new ServerError(error);
    },
  });
}
