import React from "react";
import ReactDOM from "react-dom/client";
import Auth from "./auth/authenticator";
import LazyRouter from "./routes/lazy";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth>
      <LazyRouter />
    </Auth>
  </React.StrictMode>
);
