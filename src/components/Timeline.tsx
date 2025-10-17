import useLeaderboard from '../hooks/queries/useLeaderboard';
import SteplineChart from './Charts/SteplineChart';
import Loading from './Loading';

export default function Timeline() {
  const { data } = useLeaderboard();

  const series = (data?.timeline || []).map((t) => {
    return {
      name: t.nickname,
      data: t.points.map((p) => p.total_points),
    };
  });

  if (!data?.timeline?.length) {
    return <Loading />;
  }

  return (
    <div>
      <SteplineChart
        categories={data.timeline?.[0]?.points.map((p) => p.score_date)}
        series={series}
      />
    </div>
  );
}
