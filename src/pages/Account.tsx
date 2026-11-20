import useSession from '../hooks/useSession';
import Button from '../components/Button';

export default function Account() {
  const { signOut } = useSession();

  return (
    <div className="flex flex-col justify-between p-5 w-full">
      <div className="flex justify-center mt-5">
        <Button onClick={signOut} title="Sign Out" />
      </div>
    </div>
  );
}
