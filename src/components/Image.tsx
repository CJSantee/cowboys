interface ImageProps {
  url: string;
  caption?: string;
}
export default function Image({ url, caption }: ImageProps) {
  return (
    <div
      className={`bg-white shadow-2xl border border-gray-300 rounded-sm px-4 pt-4 pb-8 w-fit flex flex-col items-center max-w-3/4`}
    >
      <img src={url} className="object-fit" />
      {caption && (
        <div className="text-sm text-gray-700 mt-4 font-handwriting text-center">
          {caption}
        </div>
      )}
    </div>
  );
}
