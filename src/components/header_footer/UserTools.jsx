import { useState, useContext } from "react"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import messageIcon from "../../assets/message-icon.svg"
import profileIcon from "../../assets/profile.svg"
import { UserContext } from "../../contexts/Context.jsx";

const UserTools = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <div className="user-tools">
            <Link className="router-link" to="/Messages">
                <img src={messageIcon} alt="" id="message-icon" />
            </Link>
            
            <Link key={user.UserName} className="router-link" to={`/Profile/${user.UserName}`}>
                <div id="profile">
                <img src={profileIcon} alt="" id="profile-icon" />
                </div>
            </Link>
        </div>
    </>
  )
}

export default UserTools