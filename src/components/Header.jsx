import { useState } from "react"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from "../assets/logo_clear.png"
import messageIcon from "../assets/message-icon.svg"
import profileIcon from "../assets/profile.svg"
import SearchBar from "./SearchBar.jsx"

const Header = () => {
  const sampleUserID = 1;
  const sampleUserPageID = 2;

  return (
    <>
      <div id="header">
        <div id="header-left">
            <Link className="router-link" to="/">
              <img src={logo} alt="" id="logo" />
            </Link>
            <Link className="router-link" to="/">
              <h1 id="website-title">World's Tapestry</h1>
            </Link>
        </div>
        <div id="header-right">
          <SearchBar/>
          {/* <img src={messageIcon} alt="" id="message-icon" /> */}
          <Link className="router-link" to="/Profile"
            state={{ 
                currentUserID: sampleUserID,
                userPageID: sampleUserID,
            }}
          >
            <div id="profile">
              <img src={profileIcon} alt="" id="profile-icon" />
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header