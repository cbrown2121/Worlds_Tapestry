import { useState, useContext } from "react"
import { UserContext } from "../../contexts/Context.jsx";
import { LoginForm } from "../form_component/LoginForm.jsx";
import "./LoginPage.css";


const LoginPage = () => {

    return (
        <>
            <div id="login-page" className="main-content">
                <LoginForm/>
            </div>
        </>
    )
}

export default LoginPage