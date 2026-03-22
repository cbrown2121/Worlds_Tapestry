import { useState, useContext } from "react"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from "../../assets//logo_clear.png"
import SearchBar from "./SearchBar.jsx"
import UserTools from "./UserTools.jsx";
import Login from "./Login.jsx";

import { UserContext } from "../../contexts/Context.jsx";
import "./HeaderFooterStyle.css";

export const Header = () => {
  const { user } = useContext(UserContext);

  let userTools = (user.UserID !== null) ? <UserTools/> :  <Login/>;

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

          { userTools }
        </div>
      </div>
    </>
  )
}

export default Header