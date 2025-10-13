import Colin from '../assets/hats/small/Colin.png';
import Thomas from '../assets/hats/small/Thomas.png';
import Joe from '../assets/hats/small/Joe.png';
import Griffin from '../assets/hats/small/Griffin.png';
import Ethan from '../assets/hats/small/Ethan.png';
import { CowboyId } from '../types';

export default function HatIcon({ cowboy_id }: { cowboy_id: CowboyId }) {
  const cowboyHatMap = {
    1: Colin,
    2: Thomas,
    3: Joe,
    4: Griffin,
    5: Ethan,
  };
  return <img src={cowboyHatMap[cowboy_id]} alt="Hat Icon" className="h-6 object-cover" />;
}
