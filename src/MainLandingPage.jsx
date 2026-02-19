import { StrictMode } from "react"
// import { createRoot } from "react-dom/client"
import "./index.css"
import Header from "./components/Header.jsx"
import LandingPage from "./components/landing_page/LandingPage.jsx"
import CategoryLandingPage from "./components/forum_landing_page/category_landing_page/CategoryLandingPage.jsx"
import ForumLandingPage from "./components/forum_landing_page/ForumLandingPage.jsx"
import ThreadPage from "./components/forum_landing_page/category_landing_page/thread_page/ThreadPage.jsx"
import Footer from "./components/Footer.jsx"
import MapPage from "./components/map_page/MapPage.jsx"

// as of this momement to view the different pages you have to communet and uncomment landing page and forum landing page
function MainLandingPage() {
    return (
        <>
            <Header />
            {/* <LandingPage /> */}
            {/* <ForumLandingPage /> */}
            {/* <CategoryLandingPage /> */}
            <ThreadPage/>
            {/* <MapPage /> */}
            <Footer />
        </>
    )
}

export default MainLandingPage