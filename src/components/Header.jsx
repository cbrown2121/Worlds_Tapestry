import { useState } from "react"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from "../assets/logo_clear.png"
import messageIcon from "../assets/message-icon.svg"
import profileIcon from "../assets/profile.svg"
import SearchBar from "./SearchBar.jsx"
import "./Header.css"

function Header( currentPage ) {
  const changePage = (newPage) => {
    currentPage = newPage;
    console.log(newPage)
  }

  return (
    <>
      <div id="header">
        <div id="header-right">
            <Link className="router-link" to="/">
              <img src={logo} alt="" id="logo" />
            </Link>
            <Link className="router-link" to="/">
              <h1 id="website-title">World's Tapestry</h1>
            </Link>
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