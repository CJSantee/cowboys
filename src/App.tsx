import { Outlet } from 'react-router';
import './App.css'
import Header from './components/Header';

function App() {
  return (
    <div className="flex flex-col min-h-screen m-0 overflow-auto">
      <Header />
      <main className="flex flex-1 grow overflow-auto justify-center">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App
