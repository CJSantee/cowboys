import { useParams } from "react-router";
import Button from "../components/Button";
import { useSession } from "@cjsantee/pondero-client";

export default function User() {
  const { username } = useParams();
  const { signOut } = useSession();

  return (
    <div>
      <h1>{username}</h1>
      <Button onClick={signOut} title="Sign Out" />
    </div>
  );
}
