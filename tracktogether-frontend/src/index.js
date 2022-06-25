import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContextProvider } from "./store/AuthContext";
import { BrowserRouter } from "react-router-dom";
// import { FilterContextProvider } from "./store/FilterContext";

const baseURL =
  window.location.origin === "http://localhost:3000"
    ? "http://localhost:8080"
    : window.location.origin;

global.baseURL = baseURL;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </BrowserRouter>
);
