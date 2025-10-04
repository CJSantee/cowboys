import Countdown from '../../components/Countdown';
import LeaderboardComponent from '../../components/Leaderboard';
import Timeline from '../../components/Timeline';

export default function Leaderboard() {
  return (
    <div className="w-full flex-col justify-center px-3 overflow-y-scroll">
      <h2 className="text-xl text-center">Time Remaining</h2>
      <Countdown targetDate={new Date('2026-01-12T18:06:00-06:00')} />
      <LeaderboardComponent />
      <Timeline />
    </div>
  );
}
