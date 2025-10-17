import { useSession } from '@cjsantee/pondero-client';
import Button from '../components/Button';
import { useEffect, useState } from 'react';
import useUpdateCowboy from '../hooks/mutations/useUpdateCowboy';
import useCowboys from '../hooks/queries/useCowboys';
import { CowboyId } from '../types';
import Switch from '../components/Switch';
import { toast } from 'sonner';

export default function Account() {
  const { user, signOut } = useSession();
  const { data: cowboys } = useCowboys();

  const [cowboy, setCowboy] = useState<{ cowboy_id: CowboyId } | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const updateCowboy = useUpdateCowboy();

  useEffect(() => {
    if (!user || !cowboys?.length) {
      return;
    }
    const userCowboy = cowboys.find((c) => c.user_id === user.user_id) ?? null;
    setCowboy(userCowboy);
    setIsPublic(!!userCowboy?.is_public);
  }, [user, cowboys]);

  const setPublic = async (value: boolean) => {
    if (!cowboy) {
      return;
    }
    setIsPublic(value);
    const { cowboy_id } = cowboy;
    updateCowboy.mutate(
      { cowboy_id, is_public: value },
      {
        onSuccess: () => {
          toast.success('Account updated successfully');
        },
      }
    );
  };

  return (
    <div className="flex flex-col justify-between p-5 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-lg">Public Profile</span>
        <Switch checked={isPublic} onChange={setPublic} />
      </div>
      <div className="flex justify-center mt-5">
        <Button onClick={signOut} title="Sign Out" />
      </div>
    </div>
  );
}
