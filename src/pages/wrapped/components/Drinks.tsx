import { type Wrapped } from "../../../hooks/queries/useWrapped";
import CowboyPhoto from "../../../components/CowboyPhoto";

export default function Drinks({ drinks }: { drinks: Wrapped['drinks'] }) {
  return (
    <div className="flex-1 flex flex-col w-full px-2">
      <div className="w-full py-2 text-center shrink-0">
        <h2 className="text-3xl font-bold mb-2">The cowboys took</h2>
        <span className="text-6xl font-black leading-none text-[#E42A1D]">
          {drinks.length}
        </span>
        <h2 className="text-3xl font-bold mt-2">photos with a drink in their hand.</h2>
      </div>
      <div className="flex-1">
        <div className="flex flex-row overflow-x-scroll gap-1">
          {drinks.map((drink) => (
            <div key={drink.photo_url} className="max-w-[80vw]">
              <CowboyPhoto
                key={drink.photo_url}
                photo_url={drink.photo_url}
                score_date={drink.score_date}
                cowboys={drink.cowboys}
                show_points
                is_public
                className="h-full w-[80vw] shadow-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}