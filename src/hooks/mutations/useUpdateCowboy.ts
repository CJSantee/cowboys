import { api, ServerError, useSession } from '@cjsantee/pondero-client';
import { useMutation } from '@tanstack/react-query';
import { CowboyId } from '../../types';

interface UpdateCowboyVariables {
  cowboy_id: CowboyId;
  is_public: boolean;
}
export default function useUpdateCowboy() {
  const { access_token } = useSession();
  return useMutation({
    mutationFn: async ({ cowboy_id, is_public }: UpdateCowboyVariables) => {
      const { success, error } = await api.patch(
        `/cowboys/${cowboy_id}`,
        { is_public },
        { access_token }
      );
      if (success) {
        return;
      }
      throw new ServerError(error);
    },
  });
}
