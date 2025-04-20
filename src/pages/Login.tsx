import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useSession } from "@cjsantee/pondero-client";
import { useNavigate } from "react-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useSession();
  const navigate = useNavigate();

  const login = async () => {
    const { success, error } = await signIn({
      username,
      password,
      rememberMe: true,
    });
    if(success) {
      navigate('/');
    } else {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input value={username} onChange={setUsername} label="Username" />
      <Input
        value={password}
        onChange={setPassword}
        label="Password"
        type="password"
      />
      <Button onClick={login} title="Login" />
    </div>
  );
}
