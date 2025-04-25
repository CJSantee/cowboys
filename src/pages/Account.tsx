import { useSession } from "@cjsantee/pondero-client"
import Button from "../components/Button";
import Input from "../components/Input";
import { useEffect, useState } from "react";
import useUpdateCowboy from "../hooks/mutations/useUpdateCowboy";
import useCowboys from "../hooks/queries/useCowboys";

export default function Account() {
  const { user, signOut } = useSession();
  const { data: cowboys } = useCowboys();

  const [cowboy, setCowboy] = useState<{ cowboy_id: number } | null>(null);
  const [nickname, setNickname] = useState('');
  const updateCowboy = useUpdateCowboy();

  useEffect(() => {
    if(!user || !cowboys?.length) {
      return;
    }
    const userCowboy = cowboys.find((c) => c.user_id === user.user_id) ?? null;
    setCowboy(userCowboy);
    setNickname(userCowboy?.nickname ?? '');
  }, [user, cowboys]);

  const onUpdate = () => {
    if(!cowboy) {
      return;
    }
    const { cowboy_id } = cowboy;
    updateCowboy.mutate({ cowboy_id, nickname });
  }

  return (
    <div className="flex flex-col justify-between pb-6">
      <div className="flex flex-col gap-2">
        <Input label="Nickname" value={nickname} onChange={setNickname} />
        <Button onClick={onUpdate} title="Update Account" />
      </div>
      <Button onClick={signOut} title="Sign Out" />
    </div>
  )
}