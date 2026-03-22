import { useState, useContext } from "react"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import messageIcon from "../../assets/message-icon.svg"
import profileIcon from "../../assets/profile.svg"
import { UserContext } from "../../contexts/Context.jsx";
import { LoginForm } from "../form_component/LoginForm.jsx";

const Login = () => {
    const { user } = useContext(UserContext);
//   const [loggedIn] = useState(user.UserID !== null);
    
    const [showLogInForm, setShowLogInForm] = useState(false);

    const handleButtonPress = () => {
        setShowLogInForm(!showLogInForm);
    }

    return (
        <>
            <div className="login" onClick={ handleButtonPress }>
                <button className="login-button">Log In</button>
            </div>

            { showLogInForm && 
                <LoginForm/>
            }
        </>
    )

}

export default Login;