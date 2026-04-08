import { useState, useEffect, useContext, componentDidMount } from "react"
import FormTextSection from "../FormTextSection.jsx";
import { useNavigate } from "react-router-dom";
import FormSelectionSection from "../FormSelectionSection.jsx";
import { UserContext } from "../../../contexts/Context.jsx";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../../utility.js";
import "../Form.css"

export const LoginForm = (props) => { // form that is centered in the middle of the page
    const { user, setUser } = useContext(UserContext);

    const setPageState = props.changePageState;

    let userNameField = { type: "text", sectionTitle: "Username", sectionID:"UserName" };
    let passwordField = { type: "text", sectionTitle: "Password", sectionID:"Password" };
    const navigate = useNavigate(); 

    const handleForumSubmit = (data) => {
        if (data.length == 1) { // user found
            let userInformation = data[0];
            setUser(userInformation);

            navigate("/");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let processedData = {};

        new FormData(event.currentTarget).forEach((value, key) => {
            processedData[key] = value;
        });

        universalDatabaseFetch(`user/${processedData["UserName"]}-${processedData["Password"]}`).then((data) => {
                handleForumSubmit(data);
        });
    }

    const changePageState = () => {
        setPageState("signup");
    }
    
    return (
        <>
            <div className="form-component login-form">
                <h1 className="form-title"> Log in </h1>
                <form onSubmit={ handleSubmit } action="">

                    <FormTextSection {...userNameField} />
                    <FormTextSection {...passwordField} />

                    <button className="submit-form-button log-in-button" type="submit"> Log in </button>
                </form>
                <button className="submit-form-button sign-up-button" onClick={changePageState}> Sign up </button>
            </div>
        </>
    )
}