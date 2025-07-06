import HatIcon from "../assets/Icon.png";
import { getShortDate } from "../utils";

interface ImageProps {
  url: string;
  caption?: string;
  date: string;
  cowboys?: {
    cowboy_id: number;
    nickname: string;
  }[];
}
export default function Image({
  url,
  caption,
  date,
  cowboys = [],
}: ImageProps) {
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
              className="flex items-center"
            >
              <img src={HatIcon} className="h-6 object-cover" />
              <span>{cowboy.nickname}</span>
            </div>
          ))}
        </div>
        <div className="flex text-xs text-gray-500 mt-2">
          {getShortDate(date)}
        </div>
      </div>
      {caption && (
        <div className="text-sm text-gray-700 mt-4 font-handwriting text-center">
          {caption}
        </div>
      )}
    </div>
  );
}
