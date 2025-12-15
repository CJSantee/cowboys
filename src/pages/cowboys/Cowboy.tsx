import { useParams } from 'react-router';
import useCowboy from '../../hooks/queries/useCowboy';
import HatIcon from '../../components/HatIcon';
import CowboyPhoto from '../../components/CowboyPhoto';

export default function Cowboy() {
  const { cowboy: cowboy_nickname } = useParams<{ cowboy: string }>();
  const { data: cowboy, isLoading } = useCowboy(cowboy_nickname!);

  if (isLoading) return <div>Loading...</div>;

  if (!cowboy)
    return (
      <div className="flex grow justify-center items-center">
        Sorry, only cowboys can view this page
      </div>
    );

  return (
    <div className="h-full pb-6">
      <div className="mx-2 flex flex-row justify-between items-center mask-fade">
        <div className="flex items-center gap-0.5">
          <HatIcon cowboy_id={cowboy.cowboy_id} />
          <h2 className="text-lg">{cowboy.nickname}</h2>
        </div>
        <span className="text-lg">{cowboy.points} Points</span>
      </div>
      <div className="h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2 lg:gap-3 overflow-y-scroll px-1 pb-2">
        {cowboy.photos.map((photo) => (
          <CowboyPhoto
            key={photo.photo_id}
            photo_url={photo.photo_url}
            score_date={photo.score_date}
            is_public={cowboy.is_public}
            cowboys={[{ cowboy_id: cowboy.cowboy_id, nickname: cowboy.nickname, points: photo.points }]}
            show_stickers
          />
        ))}
      </div>
    </div>
  );
}
