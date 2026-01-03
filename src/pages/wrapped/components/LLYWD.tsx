import CowboyPhoto from "../../../components/CowboyPhoto";
import Icon from "../../../components/Icon";
import { type Wrapped, type Activity } from "../../../hooks/queries/useWrapped";
import { useState } from "react";

export default function LLYWD({ llywd }: { llywd: Wrapped['llywd'] }) {
  const [activity, setActivity] = useState<Activity | null>(null);

  const activities: { id: Activity; label: string }[] = [
    { id: 'skydiving', label: '🪂 Went Skydiving' },
    { id: 'rockies', label: '🏔️ Went Rocky Mountain Climbin' },
    { id: 'bull', label: '🐂 Went 2.7 Seconds on a Bull Named Fu Man Chu' },
    { id: 'eagle', label: '🦅 Watched an eagle as it was flyin' },
    { id: 'love', label: '❤️ Loved deeper' },
    { id: 'speak', label: '🗣️ Spoke sweeter' },
  ];

  return (
    <div className="flex-1 flex flex-col w-full px-2 h-full">
      <div className="w-full py-2 text-center shrink-0">
        <h2 className="text-3xl font-bold mb-2">This year the cowboys...</h2>
      </div>
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        {!activity ? (
          <div className="flex flex-col gap-3 px-4">
            {activities.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivity(item.id)}
                className="w-full p-4 text-left bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors border border-stone-700"
              >
                <span className="text-xl font-bold text-stone-100">{item.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <button
              onClick={() => setActivity(null)}
              className="flex justify-between items-center p-2 rounded-xl bg-stone-800 text-stone-100"
            >
              <h3 className="text-xl font-bold">
                {activities.find(a => a.id === activity)?.label}
              </h3>
              <Icon name="close" size={4} />
            </button>
            <div className="flex flex-row overflow-x-scroll gap-4 px-4 pb-4 flex-1 items-center">
              {llywd[activity].map((photo) => (
                <div key={photo.photo_url} className="shrink-0">
                  <CowboyPhoto
                    key={photo.photo_url}
                    photo_url={photo.photo_url}
                    score_date={photo.score_date}
                    cowboys={photo.cowboys}
                    show_points
                    is_public
                    className="h-[50vh] w-auto max-w-[80vw] shadow-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}