import { useNavigate } from "react-router";
import Button from "../components/Button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center grow justify-between">
      <div className="flex items-center justify-center m-5">
        <Button onClick={() => navigate('/submit')} title="Submit Photo" size="lg" />
      </div>
    </div>
  );
}
