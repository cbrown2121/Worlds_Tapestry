import { useState, useContext } from "react"
import { UserContext } from "../../contexts/Context.jsx";
import { LoginForm } from "../form_component/login_signup/LoginForm.jsx";
import { SignupForm } from "../form_component/login_signup/SignupForm.jsx";
import "./LoginPage.css";


const LoginPage = () => {
    const [pageState, setPageState] = useState("signup");

    return (
        <>
            <div id="login-page" className="main-content">
                {pageState == "login" &&
                    <LoginForm changePageState={setPageState} />
                }

                {pageState == "signup" &&
                    <SignupForm changePageState={setPageState} />
                }
            </div>
        </>
    )
}

export default LoginPage