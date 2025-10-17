import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';

export default function Home() {
  return (
    <div className="flex flex-col items-center grow ">
      <NavBar />
      <Outlet />
    </div>
  );
}
