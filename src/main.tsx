import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthRoute from './components/AuthRoute.tsx';
import Account from './pages/Account.tsx';
import Photos from './pages/home/Photos.tsx';
import Rules from './pages/home/Rules.tsx';
import Leaderboard from './pages/home/Leaderboard.tsx';
import Cowboy from './pages/cowboys/Cowboy.tsx';
import { Toaster } from 'sonner';
import Cowboys from './pages/cowboys/Cowboys.tsx';
import Wrapped from './pages/wrapped/index.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Home />}>
              <Route path="/cowboys" element={<Outlet />}>
                <Route index element={<Cowboys />} />
                <Route path=":cowboy" element={<Cowboy />} />
              </Route>
              <Route index element={<Photos />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/wrapped" element={<Wrapped />} />
              <Route path="/rules" element={<Rules />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route
              path="/account"
              element={
                <AuthRoute>
                  <Account />
                </AuthRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
