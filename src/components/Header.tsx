import { useNavigate } from "react-router";
import HatIcon from "../assets/Icon.png";
import Button from "./Button";
import useSession from "../hooks/useSession";
import Icon from "./Icon";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useSession();

  return (
    <header className="flex items-center px-5 justify-between">
      <img src={HatIcon} className="h-14 object-cover" />
      <h1
        onClick={() => navigate("/")}
        className="text-2xl md:text-3xl font-black cursor-pointer"
      >
        Cowboy Counter
      </h1>
      {user ? (
        <div
          onClick={() => navigate("/account")}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="text-1xl md:text-2xl">{user.username}</span>
          <Icon name="person" />
        </div>
      ) : (
        <Button onClick={() => navigate("/login")} title="Login" size="sm" />
      )}
    </header>
  );
}
