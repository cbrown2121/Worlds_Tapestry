import { useState } from "react"
import logo from "../assets/logo_letters.png"
import "./Footer.css"

function Footer() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="footer">
        <div id="footer-left">
          <div id="footer-logo-container">
            <img src={logo} alt="" id="footer-logo" />
          </div>
          

          <a href="" className="footer-link" id="about-us">About Us</a>
          <a href="" className="footer-link" id="about-us">Mission</a>
          <a href="" className="footer-link" id="about-us">Report</a>
        </div>

        <div id="footer-right"></div>
      </div>
    </>
  )
}

export default Footer