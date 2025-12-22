import CowboyPhoto from "../../../components/CowboyPhoto";
import { Wrapped } from "../../../hooks/queries/useWrapped";

export default function LLYWD({ llywd }: { llywd: Wrapped['llywd'] }) {
  return (
    <div className="flex-1 flex flex-col w-full px-2">
      <div className="w-full py-2 text-center shrink-0">
        <h2 className="text-3xl font-bold mb-2">The cowboys </h2>
        <h2 className="text-3xl font-bold mt-2">Lived Like They Were Dying</h2>
      </div>
      <div className="flex-1">
        <div className="flex flex-row overflow-x-scroll gap-1">
          {llywd.map((photo) => (
            <div key={photo.photo_url} className="max-w-[80vw]">
              <CowboyPhoto
                key={photo.photo_url}
                photo_url={photo.photo_url}
                score_date={photo.score_date}
                cowboys={photo.cowboys}
                show_points
                is_public
                className="h-full w-[80vw]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}