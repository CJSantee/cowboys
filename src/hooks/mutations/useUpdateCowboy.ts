import { api, ServerError, useSession } from "@cjsantee/pondero-client";
import { useMutation } from "@tanstack/react-query";
import { CowboyId } from "../../types";

interface UpdateCowboyVariables {
  cowboy_id: CowboyId;
  nickname: string;
}
export default function useUpdateCowboy() {
  const { access_token } = useSession();
  return useMutation({
    mutationFn: async ({ cowboy_id, nickname }: UpdateCowboyVariables) => {
      const { success, error } = await api.patch(
        `/cowboys/${cowboy_id}`,
        { nickname },
        { access_token }
      );
      if (success) {
        return;
      }
      throw new ServerError(error);
    },
  });
}
