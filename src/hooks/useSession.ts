import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getJson, postJson } from '../utils/api';
import { session } from './queries/queryKeys';

/** The signed-in cowboy. */
export interface SessionUser {
  cowboy_id: number;
  user_id: number;
  username: string;
  nickname: string | null;
  first_name: string;
}

interface SignInResult {
  success: boolean;
  error?: { message: string };
}

/**
 * The current sign-in session. Cowboys sign in with their Pool Scores username and
 * password; the Worker keeps them signed in with an HttpOnly cookie.
 */
export default function useSession() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: session,
    queryFn: () => getJson<{ user: SessionUser | null }>('/auth/session'),
    staleTime: Infinity,
  });

  /** Updates the session and refetches everything else, which depends on it. */
  const setUser = (user: SessionUser | null) => {
    queryClient.setQueryData(session, { user });
    return queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] !== session[0] });
  };

  const signIn = async ({ username, password }: { username: string; password: string }): Promise<SignInResult> => {
    try {
      const { user } = await postJson<{ user: SessionUser }>('/auth/login', { username, password });
      await setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: { message: error instanceof Error ? error.message : 'Sign-in failed' } };
    }
  };

  const signOut = async () => {
    await postJson('/auth/logout');
    await setUser(null);
  };

  return { user: data?.user ?? null, loading: isPending, signIn, signOut };
}
