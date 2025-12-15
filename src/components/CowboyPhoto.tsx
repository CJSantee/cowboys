import { useEffect, useState } from 'react';
import { CowboyId } from '../types';
import { parseDate } from '../utils';
import HatIcon from './HatIcon';
import TimMcGraw from '../assets/TimMcGraw.png';
import { useSession } from '@cjsantee/pondero-client';
import { useNavigate } from 'react-router';
import clsx from 'clsx';

interface CowboyPhotoProps {
  photo_url: string;
  score_date: string;
  is_public: boolean;
  cowboys: {
    cowboy_id: CowboyId;
    nickname: string;
    points?: number;
  }[];
  show_stickers?: boolean;
  show_points?: boolean;
  className?: string;
}

export default function CowboyPhoto({ photo_url, score_date, is_public, cowboys, show_stickers = false, show_points = false, className }: CowboyPhotoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();

  const cowboy_id = cowboys.length === 1 ? cowboys[0].cowboy_id : null;
  const points = cowboys.length === 1 ? cowboys[0].points : null;

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
    <div className={clsx("bg-white px-2 pt-2 box-border rounded border border-gray-300 flex flex-col relative", className)}>
      {show_stickers && points === 5 && (
        <div
          className="absolute bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 rounded shadow z-10 flex items-center"
          style={{ top: -2, right: -8, transform: 'rotate(15deg)' }}>
          <span className="font-bold text-lg">+5</span>
          <img src={TimMcGraw} alt="Tim McGraw" className="w-5 h-5 inline-block" />
        </div>
      )}
      {show_stickers && cowboy_id && points === 3 && (
        <div
          className="absolute bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 rounded shadow z-10 flex items-center gap-1"
          style={{ top: -2, right: -8, transform: 'rotate(15deg)' }}>
          <HatIcon cowboy_id={cowboy_id} />
          <span className="font-bold text-lg">+3</span>
        </div>
      )}
      <img
        src={photo_url}
        className="block object-scale-down object-top max-w-full max-h-[500px] w-full cursor-pointer"
        onClick={() => setModalOpen(true)}
        loading="lazy"
      />
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalOpen(false)}>
          <img
            src={photo_url}
            className="max-w-full max-h-full"
          />
          {!user && !is_public && (
            <div className="absolute bottom-10 bg-white bg-opacity-90 text-gray-800 text-center px-4 py-2 rounded">
              Sorry, only cowboys can view this photo
            </div>
          )}
        </div>
      )}
      {show_points ? (
        <div className="w-full h-full flex items-start justify-between min-h-[40px]">
          <div className="flex flex-col">
            {cowboys.map((cowboy) => (
              <div key={`cowboy-${cowboy.cowboy_id}`}>
                <div
                  className="flex items-center gap-1"
                  onClick={() => navigate(`/cowboys/${cowboy.nickname}`)}>
                  <HatIcon cowboy_id={cowboy.cowboy_id} />
                  <span>{cowboy.nickname}</span>
                  {cowboy.points !== undefined && (
                    <span className="text-sm text-gray-500">+{cowboy.points}</span>
                  )}
                </div>
                {cowboy.points === 0 && (
                  <span className="text-xs text-gray-500">(Points already scored for this day)</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex text-xs text-gray-500 mt-1">{parseDate(score_date)}</div>
        </div>
      ) : (
        <div className="flex justify-center py-1">
          <span className="text-sm text-gray-500">{parseDate(score_date)}</span>
        </div>
      )}
    </div>
  );
}
