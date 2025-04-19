import Icon from "../assets/Icon.png";
import Button from "./Button";

export default function Header() {
  return (
    <header className="flex items-center max-h-[200px] px-5 justify-between">
      <img src={Icon} className="h-18 object-cover" />
      <h1 className="text-3xl font-black">Cowboy Counter</h1>
      <Button title="Login" size="sm" />
    </header>
  );
}
