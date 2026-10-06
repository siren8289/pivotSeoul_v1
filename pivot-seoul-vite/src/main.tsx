import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 전체 앱에서 URL 기반 페이지 이동을 사용할 수 있게 함 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);