import { useState, useEffect, useContext, componentDidMount } from "react"
import FormTextSection from "./FormTextSection.jsx";
import FormRadioSection from "./FormRadioSection.jsx";
import { UserContext } from "../../contexts/Context.jsx";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../utility.js";
import "./Form.css"

export const LoginForm = (props) => { // form that is centered in the middle of the page
    const { user, setUser } = useContext(UserContext);

    let userNameField = { type: "text", sectionTitle: "Username", sectionID:"UserName" };
    let passwordField = { type: "text", sectionTitle: "Password", sectionID:"Password" };

    const formatData = (formData) => {
        let processedData = {};

        for (let i = 0; i < props.passToEndPoint.length; i++) {
            let keyPair = props.passToEndPoint[i];
            processedData[keyPair.key] = keyPair.value;
        }

        return processedData;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);

        universalDatabaseFetch(`user/${formData.get("UserName")}-${formData.get("Password")}`).then((data) => {
            if (data.length == 1) { // user found
                let userInformation = data[0];
                setUser(userInformation);
                window.location.reload(); // reload window to show data change
            }
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