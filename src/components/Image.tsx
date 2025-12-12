import { useNavigate } from 'react-router';
import { parseDate } from '../utils';
import HatIcon from './HatIcon';
import { CowboyId } from '../types';
import { aclHasPermission, useSession } from '@cjsantee/pondero-client';

interface ImageProps {
  photo_url: string;
  date: string;
  cowboys?: {
    cowboy_id: CowboyId;
    nickname: string;
    points: number;
  }[];
  is_public: boolean;
}
export default function Image({ photo_url, date, cowboys = [], is_public }: ImageProps) {
  const navigate = useNavigate();
  const { user } = useSession();

  const isCowboy = aclHasPermission(user?.acl ?? 'invalid', 'cowboy');

  return (
    <div className="bg-white border border-gray-300 rounded-sm p-4 w-fit flex flex-col items-start justify-start max-w-full h-fit">
      <img
        src={photo_url}
        className="block object-scale-down object-top max-w-full max-h-[500px] w-full"
      />
      <div className="w-full flex items-start justify-between">
        <div className="flex flex-col">
          {cowboys.map((cowboy) => (
            <div
              key={`cowboy-${cowboy.cowboy_id}`}
              className="flex items-center gap-1"
              onClick={() => (isCowboy ? navigate(`/cowboys/${cowboy.nickname}`) : undefined)}>
              <HatIcon cowboy_id={cowboy.cowboy_id} />
              <span>{cowboy.nickname}</span>
              <span className="text-sm text-gray-500">+{cowboy.points}</span>
              {cowboy.points === 0 && (
                <span className="text-xs text-gray-500">(Points already scored for this day)</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex text-xs text-gray-500 mt-2">{parseDate(date)}</div>
      </div>
      {!is_public && !isCowboy && (
        <div className="flex items-center justify-center w-full">
          <span className="text-sm text-gray-700 text-center">
            Sorry, only cowboys can view this photo
          </span>
        </div>
      )}
    </div>
  );
}
