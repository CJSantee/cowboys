import HatIcon from "../assets/Icon.png";

interface ImageProps {
  url: string;
  caption?: string;
  cowboys?: {
    cowboy_id: number;
    nickname: string;
  }[];
}
export default function Image({ url, caption, cowboys = [] }: ImageProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-sm p-4 w-fit flex flex-col items-start justify-start max-w-full h-fit">
      <img
        src={url}
        className="block object-scale-down object-top max-w-full max-h-[500px] w-full"
      />
      <div className="w-full items-start">
        {cowboys.map((cowboy) => (
          <div key={`cowboy-${cowboy.cowboy_id}`} className="flex items-center">
            <img src={HatIcon} className="h-6 object-cover" />
            <span>{cowboy.nickname}</span>
          </div>
        ))}
      </div>
      {caption && (
        <div className="text-sm text-gray-700 mt-4 font-handwriting text-center">
          {caption}
        </div>
      )}
    </div>
  );
}
