import { Outlet } from "react-router";
import "./App.css";
import Header from "./components/Header";
import { ThemeConfig } from "flowbite-react";

function App() {
  return (
    <>
      <ThemeConfig />
      <Header />
      <main className="flex grow overflow-hidden justify-center">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;
