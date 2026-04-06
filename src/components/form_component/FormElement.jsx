import { useState, useEffect, useContext, Children } from "react"
import FormTextSection from "./FormTextSection.jsx";
import FormRadioSection from "./FormRadioSection.jsx";
import { UserContext } from "../../contexts/Context.jsx";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../utility.js";
import "./Form.css"
import { useNavigate } from "react-router-dom";

function FormElement( props ) {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        let processedData = {};

        new FormData(event.currentTarget).forEach((value, key) => {
            processedData[key] = value;
        });

        for (let i = 0; i < props.passToEndPoint.length; i++) {
            let keyPair = props.passToEndPoint[i];
            processedData[keyPair.key] = keyPair.value;
        }

        console.log(processedData)

        universalDatabaseInteraction(props.method, props.endPoint, processedData).then((data) => {
            if (props.updateUserInformation) { // reset user information and go to profile
                setUser({ UserID: parseInt(processedData.UserID), UserName: processedData.UserName });
                navigate(`/Profile/${processedData.UserName}`);
            }

            window.location.reload(""); // reload window to show data change
        });
    }

    return (
        <>
            <div className="form-component">
                <h1 className="form-title"> { props.formTitle } </h1>
                <form onSubmit={ handleSubmit } action="">
                    {props.children}
                </form>
            </div>
        </>
    )
}

export default FormElement