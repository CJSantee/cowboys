import { useNavigate } from "react-router";
import Button from "../../components/Button";
import Photos from "../../components/Photos";
import AuthComponent from "../../components/AuthComponent";
import Unauthorized from "../../components/Unauthorized";

export default function PhotosPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="grow overflow-auto">
        <AuthComponent
          UnauthenticatedComponent={() => (
            <Unauthorized asset="Cowboy Photos" />
          )}
        >
          <Photos />
        </AuthComponent>
      </div>
      <div className="flex justify-center mt-2 min-h-content">
        <Button onClick={() => navigate("/submit")} title="Submit Photo" />
      </div>
    </>
  );
}
