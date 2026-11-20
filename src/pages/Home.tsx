import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';
import useSession from '../hooks/useSession';
import { useEffect, useState } from 'react';
import WelcomeModal from './home/components/WelcomeModal';

export default function Home() {
  const { user, loading } = useSession();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowWelcomeModal(true);
    }
  }, [loading, user]);

  return (
    <div className="flex flex-col items-center grow ">
      <NavBar />
      <Outlet />
      <WelcomeModal open={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
    </div>
  );
}
