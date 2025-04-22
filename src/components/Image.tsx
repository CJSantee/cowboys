import HatIcon from "../assets/Icon.png";

interface ImageProps {
  url: string;
  caption?: string;
  cowboys?: {
    cowboy_id: number,
    nickname: string,
  }[],
}
export default function Image({ url, caption, cowboys = [] }: ImageProps) {
  return (
    <div
      className={`bg-white shadow-2xl border border-gray-300 rounded-sm px-4 pt-4 pb-8 w-fit flex flex-col items-center max-w-full`}
    >
      <img src={url} className="object-fit" />
      <div className="w-full items-start">
        {cowboys.map(cowboy => (
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
