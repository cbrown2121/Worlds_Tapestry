import { createRoot } from "react-dom/client";
import "./index.css";
import LandingPage from "./components/landing_page/LandingPage.jsx";
import App from "./app.jsx";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
  

createRoot(document.getElementById("root")).render(
  <>
    <App/>
  </>
)