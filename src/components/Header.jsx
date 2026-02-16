import { useState } from "react"
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
          {/* Temporary navigation */}
            <img src={logo} alt="" id="logo" />
            <h1 id="website-title">World's Tapestry</h1>
            {/* <button onClick={changePage("LandingPage")} id="LandingPage">Home</button>
            <button onClick={changePage("ForumLandingPage")} id="ForumLandingPage">Forum Landing</button>
            <button onClick={changePage("CategoryLandingPage")} id="CategoryLandingPage">Category Landing</button>
            <button onClick={changePage("ThreadPage")} id="ThreadPage">Thread Page</button>
            <button onClick={changePage("MapPage")} id="MapPage">Map Page</button> */}
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