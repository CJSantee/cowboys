import useCowboys from "../hooks/queries/useCowboys";
import { CowboyId } from "../types";
import Checkbox from "./Checkbox";

interface CowboySelectProps {
  value: CowboyId[];
  onChange: (cowboy_ids: CowboyId[]) => void;
}
export default function CowboySelect({
  value: selectedCowboys,
  onChange: setSelectedCowboys,
}: CowboySelectProps) {
  const { data: cowboys, isLoading } = useCowboys();

  const toggleSelected = (cowboy_id: CowboyId) => {
    if (selectedCowboys.includes(cowboy_id)) {
      const filteredCowboys = selectedCowboys.filter(
        (cId) => cId !== cowboy_id
      );
      setSelectedCowboys(filteredCowboys);
    } else {
      setSelectedCowboys([...selectedCowboys, cowboy_id]);
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="w-full">
      <h3>Select Cowboys:</h3>
      <div className="flex gap-2 justify-between">
        {cowboys?.map((cowboy) => (
          <div
            key={`cowboy-${cowboy.cowboy_id}`}
            className="flex items-center gap-1"
          >
            <Checkbox
              checked={selectedCowboys.includes(cowboy.cowboy_id)}
              setChecked={() => toggleSelected(cowboy.cowboy_id)}
            />
            <span>{cowboy.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
