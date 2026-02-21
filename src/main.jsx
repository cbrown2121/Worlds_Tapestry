import { createRoot } from "react-dom/client";
import "./index.css";
import LandingPage from "./components/landing_page/LandingPage.jsx";
import App from "./app.jsx";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import MessagePage from "./components/messages_page/MessagesPage.jsx";
import ProfilePage from "./components/profile_page/ProfilePage.jsx";
  

createRoot(document.getElementById("root")).render(
  <>
    <App/>
  </>
)