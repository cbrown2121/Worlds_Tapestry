import { useState, useContext } from "react"
import { UserContext } from "../../contexts/Context.jsx";
import { LoginForm } from "../form_component/LoginForm.jsx";


const LoginPage = () => {

    return (
        <>
            <div id="landing-page" className="main-content">
                <LoginForm/>
            </div>
        </>
    )
}

export default LoginPage




