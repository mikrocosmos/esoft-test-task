import { createRoot } from "react-dom/client";
import "./index.css";
import MainPage from "@/pages/MainPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </QueryClientProvider>
  </BrowserRouter>,
);
