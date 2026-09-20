import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { DashboardAuthProvider } from "./Dashboard/context/DashboardAuthContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DashboardAuthProvider>
        <App />
      </DashboardAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
