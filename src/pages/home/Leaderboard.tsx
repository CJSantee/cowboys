import LeaderboardComponent from '../../components/Leaderboard';
import Timeline from '../../components/Timeline';

export default function Leaderboard() {
  return (
    <div className="w-full flex-col justify-center px-3">
      <LeaderboardComponent />
      <Timeline />
    </div>
  );
}
