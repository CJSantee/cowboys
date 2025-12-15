import { type Wrapped } from "../../../hooks/queries/useWrapped";
import CowboyPhoto from "../../../components/CowboyPhoto";

export default function Horses({ horses }: { horses: Wrapped['horses'] }) {
  return (
    <div className="flex-1 flex flex-col w-full px-2">
      <div className="w-full py-2 text-center shrink-0">
        <h2 className="text-3xl font-bold mb-2">The cowboys rode horses</h2>
        <span className="text-6xl font-black leading-none text-[#E42A1D]">
          {horses.length}
        </span>
        <h2 className="text-3xl font-bold mt-2">times this year</h2>
      </div>
      <div className="flex-1">
        <div className="flex flex-row overflow-x-scroll gap-1">
          {horses.map((horse) => (
            <div key={horse.photo_url} className="max-w-[80vw]">
              <CowboyPhoto
                key={horse.photo_url}
                photo_url={horse.photo_url}
                score_date={horse.score_date}
                cowboys={horse.cowboys}
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