import { useSession } from '@cjsantee/pondero-client';
import Button from '../components/Button';
import Input from '../components/Input';
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
  const [nickname, setNickname] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const updateCowboy = useUpdateCowboy();

  useEffect(() => {
    if (!user || !cowboys?.length) {
      return;
    }
    const userCowboy = cowboys.find((c) => c.user_id === user.user_id) ?? null;
    setCowboy(userCowboy);
    setNickname(userCowboy?.nickname ?? '');
    setIsPublic(!!userCowboy?.is_public);
  }, [user, cowboys]);

  const onUpdate = () => {
    if (!cowboy) {
      return;
    }
    const { cowboy_id } = cowboy;
    updateCowboy.mutate(
      { cowboy_id, nickname, is_public: isPublic },
      {
        onSuccess: () => {
          toast.success('Account updated successfully');
        },
      }
    );
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-col gap-5">
        <Input label="Nickname" value={nickname} onChange={setNickname} />
        <div className="flex justify-between items-center">
          <span>Public Profile</span>
          <Switch checked={isPublic} onChange={setIsPublic} />
        </div>
        <Button onClick={onUpdate} title="Update Account" />
      </div>
      <Button onClick={signOut} title="Sign Out" />
    </div>
  );
}
