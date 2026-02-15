import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import Header from "./components/Header.jsx"
import LandingPage from "./components/landing_page/LandingPage.jsx"
import CategoryLandingPage from "./components/forum_landing_page/category_landing_page/CategoryLandingPage.jsx"
import ForumLandingPage from "./components/forum_landing_page/ForumLandingPage.jsx"
import Footer from "./components/Footer.jsx"

// as of this momement to view the different pages you have to communet and uncomment landing page and forum landing page
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    {/* <LandingPage /> */}
    {/* <ForumLandingPage /> */}
    <CategoryLandingPage />
    <Footer />
  </StrictMode>,
)