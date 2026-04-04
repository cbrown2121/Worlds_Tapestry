import { useState, useContext } from "react"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import messageIcon from "../../assets/message-icon.svg"
import profileIcon from "../../assets/profile.svg"
import { UserContext } from "../../contexts/Context.jsx";

const Login = () => {
    const { user } = useContext(UserContext);
//   const [loggedIn] = useState(user.UserID !== null);
    
    const [showLogInForm, setShowLogInForm] = useState(false);

    const handleButtonPress = () => {
        setShowLogInForm(!showLogInForm);
    }

    // move to be on its own page instead of being a floating form on any page

    return (
        <>
            <Link to="/login">
                <button className="login-button">Sign Up</button>
            </Link>


        </>
    )

}

export default Login;

