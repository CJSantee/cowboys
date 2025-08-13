import { api, ServerError, useSession } from '@cjsantee/pondero-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { charter } from '../queries/queryKeys';

export default function useAssentCharter() {
  const { access_token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cowboy_charter_version_id }: { cowboy_charter_version_id: number }) => {
      const { success, error } = await api.post(
        '/cowboys/charter',
        { cowboy_charter_version_id },
        { access_token }
      );
      if (success) {
        return;
      }
      throw new ServerError(error);
    },
    onSuccess: () => {
      // Invalidate the charter query to refresh the data
      queryClient.invalidateQueries({ queryKey: charter });
    },
  });
}
