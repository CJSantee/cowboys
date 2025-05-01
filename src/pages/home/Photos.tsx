import { useNavigate } from "react-router";
import Button from "../../components/Button";
import Photos from "../../components/Photos";

export default function PhotosPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="grow overflow-auto">
        <Photos />
      </div>
      <div className="flex justify-center mt-2 min-h-content">
        <Button onClick={() => navigate("/submit")} title="Submit Photo" />
      </div>
    </>
  );
}
