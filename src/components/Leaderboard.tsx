import useLeaderboard from '../hooks/queries/useLeaderboard';
import BarChart from './Charts/BarChart';
import Loading from './Loading';

export default function Leaderboard() {
  const { data } = useLeaderboard();

  if (!data?.leaderboard?.length) {
    return <Loading />;
  }

  return (
    <div className="">
      <BarChart
        categories={data.leaderboard.map((l) => l.nickname)}
        series={[
          {
            name: 'Cowboys',
            data: data.leaderboard.map((l) => l.points),
          },
        ]}
      />
    </div>
  );
}
