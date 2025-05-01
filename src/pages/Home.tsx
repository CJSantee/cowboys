import { Outlet, useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  const pages = [
    {
      id: "photos",
      title: "Photos",
      href: "/",
    },
    {
      id: "leaderboard",
      title: "Leaderboard",
      href: "/leaderboard",
    },
    {
      id: "rules",
      title: "Rules",
      href: "/rules",
    },
  ];

  return (
    <div className="flex flex-col items-center grow justify-between">
      <div className="flex justify-between w-full px-5">
        {pages.map((page) => (
          <div
            key={page.id}
            className="cursor-pointer"
            onClick={() => navigate(page.href)}
          >
            <h3>{page.title}</h3>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
