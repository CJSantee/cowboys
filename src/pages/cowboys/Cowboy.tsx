import { useParams } from 'react-router';
import useCowboy, { type CowboyData } from '../../hooks/queries/useCowboy';
import { parseDate } from '../../utils';
import HatIcon from '../../components/HatIcon';
import TimMcGraw from '../../assets/TimMcGraw.png';
import { CowboyId } from '../../types';
import { useState, useEffect } from 'react';

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
          <CowboyPhoto key={photo.photo_id} cowboy_id={cowboy.cowboy_id} photo={photo} />
        ))}
      </div>
    </div>
  );
}

function CowboyPhoto({
  cowboy_id,
  photo,
}: {
  cowboy_id: CowboyId;
  photo: CowboyData['photos'][0];
}) {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  return (
    <div className="bg-white px-2 pt-2 box-border rounded border border-gray-300 flex flex-col relative">
      {photo.points === 5 && (
        <div
          className="absolute bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 rounded shadow z-10 flex items-center"
          style={{ top: -2, right: -8, transform: 'rotate(15deg)' }}>
          <span className="font-bold text-lg">+5</span>
          <img src={TimMcGraw} alt="Tim McGraw" className="w-5 h-5 inline-block" />
        </div>
      )}
      {photo.points === 3 && (
        <div
          className="absolute bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 rounded shadow z-10 flex items-center gap-1"
          style={{ top: -2, right: -8, transform: 'rotate(15deg)' }}>
          <HatIcon cowboy_id={cowboy_id} />
          <span className="font-bold text-lg">+3</span>
        </div>
      )}
      <img
        src={photo.alt_photos?.[0]?.url || photo.photo_url}
        alt={`photo-${photo.photo_id}`}
        className="w-full h-full object-contain object-top cursor-pointer"
        onClick={() => setModalOpen(true)}
        loading="lazy"
      />
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalOpen(false)}>
          <img
            src={photo.photo_url}
            alt={`photo-${photo.photo_id}`}
            className="max-w-full max-h-full"
          />
        </div>
      )}
      <div className="flex justify-center py-1">
        <span className="text-sm text-gray-500">{parseDate(photo.score_date)}</span>
      </div>
    </div>
  );
}
