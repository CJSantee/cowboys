import Loading from '../../components/Loading';
import useCowboys, { type Cowboy as CowboyType } from '../../hooks/queries/useCowboys';
import Colin from '../../assets/hats/Colin.png';
import Thomas from '../../assets/hats/Thomas.png';
import Joe from '../../assets/hats/Joe.png';
import Griffin from '../../assets/hats/Griffin.png';
import Ethan from '../../assets/hats/Ethan.png';
import { CowboyId } from '../../types';
import { useNavigate } from 'react-router';
import clsx from 'clsx';

export default function Cowboys() {
  const { data: cowboys } = useCowboys();

  if (!cowboys) {
    return <Loading />;
  }

  return (
    <div className="px-2 overflow-scroll">
      <div className="mb-2 flex justify-center">
        <div className="w-1/2">
          <Cowboy cowboy={cowboys[0]} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cowboys.slice(1).map((cowboy) => (
          <Cowboy key={cowboy.cowboy_id} cowboy={cowboy} />
        ))}
      </div>
    </div>
  );
}

function Cowboy({ cowboy }: { cowboy: CowboyType }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white pt-3 px-3 max-w-64 box-border rounded border border-gray-300"
      onClick={() => navigate(`/cowboys/${cowboy.nickname}`)}>
      <div
        className={clsx(
          'aspect-square w-full flex items-center justify-center bg-gray-100',
          cowboy.photo_url ? '' : 'box-border rounded border border-gray-300'
        )}>
        {cowboy.photo_url ? (
          <img
            className="h-full w-full object-cover"
            src={cowboy.photo_url}
            alt={cowboy.nickname}
          />
        ) : (
          <HatIcon cowboy_id={cowboy.cowboy_id} />
        )}
      </div>
      <div className="text-center">{cowboy.nickname}</div>
      <div className="flex justify-between mt-1 text-sm text-gray-600">
        <span>{cowboy.points} Points</span>
        <span>{cowboy.num_photos} Photos</span>
      </div>
    </div>
  );
}

function HatIcon({ cowboy_id }: { cowboy_id: CowboyId }) {
  const cowboyHatMap = {
    1: Colin,
    2: Thomas,
    3: Joe,
    4: Griffin,
    5: Ethan,
  };
  return <img src={cowboyHatMap[cowboy_id]} alt="Hat Icon" className="object-cover max-w-32" />;
}
