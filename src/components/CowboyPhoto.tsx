import { useEffect, useState } from 'react';
import { CowboyId } from '../types';
import { parseDate } from '../utils';
import HatIcon from './HatIcon';
import TimMcGraw from '../assets/TimMcGraw.png';
import { useSession } from '@cjsantee/pondero-client';

interface CowboyPhotoProps {
  cowboy_id: CowboyId | null;
  photo: {
    photo_id: number;
    points: number;
    alt_photos: { url: string }[];
    photo_url: string;
    score_date: string;
    is_public: boolean;
  };
}

export default function CowboyPhoto({ cowboy_id, photo }: CowboyPhotoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useSession();

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
      {cowboy_id && photo.points === 3 && (
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
            src={photo.alt_photos?.[0]?.url || photo.photo_url}
            alt={`photo-${photo.photo_id}`}
            className="max-w-full max-h-full"
          />
          {!user && !photo.is_public && (
            <div className="absolute bottom-10 bg-white bg-opacity-90 text-gray-800 text-center px-4 py-2 rounded">
              Sorry, only cowboys can view this photo
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center py-1">
        <span className="text-sm text-gray-500">{parseDate(photo.score_date)}</span>
      </div>
    </div>
  );
}
