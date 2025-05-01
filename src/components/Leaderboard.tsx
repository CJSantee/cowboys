import { Spinner } from "flowbite-react";
import useLeaderboard from "../hooks/queries/useLeaderboard";
import BarChart from "./Charts/BarChart";

export default function Leaderboard() {
  const { data: leaderboard } = useLeaderboard();

  if (!leaderboard?.length) {
    return <Spinner />;
  }

  return (
    <div className="flex grow w-full px-3">
      <BarChart
        categories={leaderboard.map((l) => l.nickname)}
        series={[
          {
            name: "Cowboys",
            data: leaderboard.map((l) => l.points),
          },
        ]}
      />
    </div>
  );
}
