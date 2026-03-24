import { useState, useEffect, useContext, componentDidMount } from "react"
import FormTextSection from "./FormTextSection.jsx";
import { useNavigate } from "react-router-dom";
import FormRadioSection from "./FormRadioSection.jsx";
import { UserContext } from "../../contexts/Context.jsx";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../utility.js";
import "./Form.css"

export const LoginForm = () => { // form that is centered in the middle of the page
    const { user, setUser } = useContext(UserContext);

    let userNameField = { type: "text", sectionTitle: "Username", sectionID:"UserName" };
    let passwordField = { type: "text", sectionTitle: "Password", sectionID:"Password" };
    const navigate = useNavigate(); 

    const handleForumSubmit = (data) => {
        if (data.length == 1) { // user found
            let userInformation = data[0];
            setUser(userInformation);

            navigate("/");
            // window.location.reload(); // reload window to show data change
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let formData = new FormData(event.currentTarget);
        
        universalDatabaseFetch(`user/${formData.get("UserName")}-${formData.get("Password")}`).then((data) => {
            handleForumSubmit(data);
        });
    }
    
    return (
        <>
            <div className="form-component login-form">
                <h1 className="form-title"> Log in </h1>
                <form onSubmit={ handleSubmit } action="">

                    <FormTextSection {...userNameField} />
                    <FormTextSection {...passwordField} />

                    <button className="submit-form-button" type="submit"> Log in </button>
                </form>
                
            </div>
        </>
    )
}