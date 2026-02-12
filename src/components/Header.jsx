import { useState } from "react"
import logo from "../assets/logo_clear.png"
import messageIcon from "../assets/message-icon.svg"
import profileIcon from "../assets/profile.svg"
import SearchBar from "./SearchBar.jsx"
import "./Header.css"

function Header() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="header">
        <div id="header-right">
            <img src={logo} alt="" id="logo" />
            <h1 id="website-title">World's Tapestry</h1>
        </div>
        <div id="header-left">
          <SearchBar/>
          <img src={messageIcon} alt="" id="message-icon" />
          <div id="profile">
            <img src={profileIcon} alt="" id="profile-icon" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Header