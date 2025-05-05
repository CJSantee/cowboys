import LeaderboardComponent from "../../components/Leaderboard";
import AuthComponent from "../../components/AuthComponent";
import Unauthorized from "../../components/Unauthorized";

export default function Leaderboard() {
  return (
    <AuthComponent
      UnauthenticatedComponent={() => <Unauthorized asset="the Leaderboard" />}
    >
      <LeaderboardComponent />
    </AuthComponent>
  );
}
