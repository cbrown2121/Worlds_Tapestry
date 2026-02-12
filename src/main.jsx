import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import Header from "./components/Header.jsx"
import LandingPage from "./components/landing_page/LandingPage.jsx"
import Footer from "./components/Footer.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    <LandingPage />
    <Footer />
  </StrictMode>,
)