import { useNavigate } from "react-router";
import Button from "../../components/Button";
import Photos from "../../components/Photos";
import AuthComponent from "../../components/AuthComponent";
import Unauthorized from "../../components/Unauthorized";
import { useSession } from "@cjsantee/pondero-client";

export default function PhotosPage() {
  const navigate = useNavigate();
  const { user } = useSession();

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
      {user && (
        <div className="flex justify-center mt-2 min-h-content">
          <Button onClick={() => navigate("/submit")} title="Submit Photo" />
        </div>
      )}
    </>
  );
}
