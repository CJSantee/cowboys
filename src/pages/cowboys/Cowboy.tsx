import { useParams } from "react-router";
import useCowboy from "../../hooks/queries/useCowboy";
import { parseDate } from "../../utils";
import HatIcon from "../../components/HatIcon";

export default function Cowboy() {
  const { cowboy: cowboy_nickname } = useParams<{ cowboy: string }>();
  const { data: cowboy, isLoading } = useCowboy(cowboy_nickname!);

  if (isLoading) return <div>Loading...</div>;

  if (!cowboy) return <div>Cowboy not found</div>;

  return (
    <div className="h-full pb-6">
      <div className="mx-2 flex flex-row justify-between items-center mask-fade">
        <div className="flex items-center gap-0.5">
          <HatIcon cowboy_id={cowboy.cowboy_id} />
          <h2 className="text-lg">{cowboy.nickname}</h2>
        </div>
        <span className="text-lg">{cowboy.points} Points</span>
      </div>
      <div className="h-full grid grid-cols-2 gap-1 overflow-y-scroll px-1 pb-2">
        {cowboy.photos.map((photo) => (
          <div
            key={photo.photo_id}
            className="bg-white px-2 pt-2 box-border rounded border border-gray-300 flex flex-col"
          >
            <img
              src={photo.photo_url}
              alt={`photo-${photo.photo_id}`}
              className="w-full h-full object-contain object-top"
            />
            <div className="flex justify-center py-1">
              <span className="text-sm text-gray-500">
                {parseDate(photo.score_date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
