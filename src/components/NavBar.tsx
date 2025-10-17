import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    {
      id: 'photos',
      title: 'Photos',
      href: '/',
    },
    {
      id: 'cowboys',
      title: 'Cowboys',
      href: '/cowboys',
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      href: '/leaderboard',
    },
    {
      id: 'rules',
      title: 'Rules',
      href: '/rules',
    },
  ];

  return (
    <div className="flex justify-between w-full px-5 mb-2">
      {pages.map((page) => {
        return (
          <div
            key={page.id}
            className={clsx('cursor-pointer', {
              'border-b-2 border-b-amber-700':
                location.pathname === '/'
                  ? page.href === location.pathname
                  : location.pathname !== '/' &&
                    page.href !== '/' &&
                    location.pathname.startsWith(page.href),
            })}
            onClick={() => navigate(page.href)}>
            <h3>{page.title}</h3>
          </div>
        );
      })}
    </div>
  );
}
