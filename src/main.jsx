import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Header from "./components/Header.jsx";
import LandingPage from "./components/landing_page/LandingPage.jsx";
import CategoryLandingPage from "./components/forum_landing_page/category_landing_page/CategoryLandingPage.jsx";
import ForumLandingPage from "./components/forum_landing_page/ForumLandingPage.jsx";
import ThreadPage from "./components/forum_landing_page/category_landing_page/thread_page/ThreadPage.jsx";
import Footer from "./components/Footer.jsx";

// NEW: Profile + Messages pages for PR2 demo
import ProfilePage from "./components/profile/ProfilePage.jsx";
import MessagesPage from "./components/messages/MessagesPage.jsx";

// as of this moment to view the different pages you have to comment and uncomment
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />

    {/* Existing pages */}
    {/* <LandingPage /> */}
    {/* <ForumLandingPage /> */}
    {/* <CategoryLandingPage /> */}
    {/* <ThreadPage /> */}

    {/* PR2 Demo pages */}
    <ProfilePage />
    <hr />
    <MessagesPage />

    <Footer />
  </StrictMode>
);

