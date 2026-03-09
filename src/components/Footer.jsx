import { useState } from "react"
import { Link } from 'react-router-dom';
import logo from "../assets/logo_letters_framed.png"

function Footer() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="footer">
        <div id="footer-left">
          <div id="footer-logo-container">
            <img src={logo} alt="" id="footer-logo" />
          </div>
          

          <Link className="router-link" 
                to={ `/AboutUs` } 
          >
            <p>About Us</p>
          </Link>

          <Link className="router-link" 
                to={ `/Guidelines` } 
          >
            <p>Guidelines</p>
          </Link>
          
          <Link className="router-link" 
                to={ `/FAQ` } 
          >
            <p>FAQ</p>
          </Link>
          
          <Link className="router-link" 
                to={ `/Report` } 
          >
            <p>Report</p>
          </Link>
        </div>

        <div id="footer-right"></div>
      </div>
    </>
  )
}

export default Footer