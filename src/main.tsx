import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.tsx";
import { SessionProvider } from "@cjsantee/pondero-client";
import Login from "./pages/Login.tsx";
import Submit from "./pages/Submit.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthRoute from "./components/AuthRoute.tsx";
import Account from "./pages/Account.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/submit"
                element={
                  <AuthRoute>
                    <Submit />
                  </AuthRoute>
                }
              />
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
      </SessionProvider>
    </QueryClientProvider>
  </StrictMode>
);
