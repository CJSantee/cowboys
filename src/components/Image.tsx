import { useNavigate } from "react-router";
import { parseDate } from "../utils";
import HatIcon from "./HatIcon";
import { CowboyId } from "../types";

interface ImageProps {
  url: string;
  caption?: string;
  date: string;
  cowboys?: {
    cowboy_id: CowboyId;
    nickname: string;
    points: number;
  }[];
}
export default function Image({
  url,
  caption,
  date,
  cowboys = [],
}: ImageProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-300 rounded-sm p-4 w-fit flex flex-col items-start justify-start max-w-full h-fit">
      <img
        src={url}
        className="block object-scale-down object-top max-w-full max-h-[500px] w-full"
      />
      <div className="w-full flex items-start justify-between">
        <div className="flex flex-col">
          {cowboys.map((cowboy) => (
            <div
              key={`cowboy-${cowboy.cowboy_id}`}
              className="flex items-center gap-1"
              onClick={() => navigate(`/cowboys/${cowboy.nickname}`)}
            >
              <HatIcon cowboy_id={cowboy.cowboy_id} />
              <span>{cowboy.nickname}</span>
              <span className="text-sm text-gray-500">+{cowboy.points}</span>
              {cowboy.points === 0 && (
                <span className="text-xs text-gray-500">
                  (Points already scored for this day)
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex text-xs text-gray-500 mt-2">{parseDate(date)}</div>
      </div>
      {caption && (
        <div className="text-sm text-gray-700 mt-4 font-handwriting text-center">
          {caption}
        </div>
      )}
    </div>
  );
}
