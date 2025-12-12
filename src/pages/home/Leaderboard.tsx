import Countdown from '../../components/Countdown';
import LeaderboardComponent from '../../components/Leaderboard';
import Timeline from '../../components/Timeline';
import { isCompetitionOver } from '../../utils';
import { COMPETITION_END_DATE } from '../../utils/constants';

export default function Leaderboard() {
  const competitionOver = isCompetitionOver();
  return (
    <div className="w-full flex-col justify-center px-3 overflow-y-scroll">
      {!competitionOver ? (
        <div>
          <h2 className="text-xl text-center">Time Remaining</h2>
          <Countdown targetDate={COMPETITION_END_DATE} />
        </div>
      ) : (
        <div>
          <h2 className="text-xl text-center">Results</h2>
        </div>
      )}
      <LeaderboardComponent />
      <Timeline />
    </div>
  );
}
