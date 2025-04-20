import Button from "../components/Button";
import Image from "../components/Image";

export default function Home() {
  return (
    <div>
      <Image />
      <div className="flex items-center justify-center m-2">
        <Button onClick={() => {}} title="Submit Photo" size="lg" />
      </div>
    </div>
  );
}
