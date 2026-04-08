import { useState, useEffect, useContext, componentDidMount } from "react"
import FormTextSection from "../FormTextSection.jsx";
import { useNavigate } from "react-router-dom";
import FormSelectionSection from "../FormSelectionSection.jsx";
import { UserContext } from "../../../contexts/Context.jsx";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../../utility.js";
import "../Form.css"

export const SignupForm = (props) => { // form that is centered in the middle of the page
    const { user, setUser } = useContext(UserContext);

    const setPageState = props.changePageState;

    let userNameField = { type: "text", sectionTitle: "Username", sectionID:"UserName" };
    let emailField = { type: "text", sectionTitle: "Email", sectionID:"Email" };
    let passwordField = { type: "text", sectionTitle: "Password", sectionID:"Password" };
    const navigate = useNavigate(); 

    const handleForumSubmit = (data) => {
        let returnedUserData = data[2][0]; // first two elements correspond to the data inserted and the fetch for the recent insert- the third element has the actual data
        let userInformation = {UserID: returnedUserData.UserID, UserName: returnedUserData.UserName};
        setUser(userInformation);
        navigate("/");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let processedData = {};

        new FormData(event.currentTarget).forEach((value, key) => {
            processedData[key] = value;
        });

        universalDatabaseFetch(`check-user/${processedData["UserName"]}/${processedData["Email"]}`).then((data) => {
            if (0 < data.users_in_database) {
                console.log("username or password already in use")
            } else {
                universalDatabaseInteraction("post", "create-user", processedData).then((signupData) => {
                    handleForumSubmit(signupData);
                });
            }
        });
    }

    const changePageState = () => {
        setPageState("login");
    }
    
    return (
        <>
            <div className="form-component sign-up-form login-form">
                <h1 className="form-title"> Sign Up </h1>
                <form onSubmit={ handleSubmit } action="">

                    <FormTextSection {...userNameField} />
                    <FormTextSection {...emailField} />
                    <FormTextSection {...passwordField} />

                    <button className="submit-form-button sign-up-button" type="submit"> Sign up </button>

                </form>
                <button className="submit-form-button log-in-button" onClick={changePageState}> Log in </button>
            </div>
        </>
    )
}