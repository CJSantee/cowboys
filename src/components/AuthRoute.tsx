import useSession from "../hooks/useSession";
import { Navigate, useLocation } from "react-router";

interface AuthRouteProps {
  children: React.ReactNode;
}
function AuthRoute({ children }: AuthRouteProps) {
  const session = useSession();
  const location = useLocation();

  if (session.loading) {
    return <div />;
  }

  // Not logged in
  if (!session.user) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
}

export default AuthRoute;
