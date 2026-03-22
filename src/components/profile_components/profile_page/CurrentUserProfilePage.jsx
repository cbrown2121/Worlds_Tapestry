import { useEffect, useState, useContext } from "react";
import FormElement from "../../form_component/FormElement.jsx";
import UserProfileData from "./UserProfileData.jsx";
import { UserContext } from "../../../contexts/Context.jsx";
import "./ProfilePage.css";
import { Link } from "react-router-dom";

export default function CurrentUserProfilePage() {
    const { user, logOutUser } = useContext(UserContext);

    let forumUserNameSection = { type: "text", sectionTitle: "Username", sectionID:"UserName" };
    let forumEmailSection = { type: "text", sectionTitle: "Email", sectionID:"Email" };

    const handleButtonPress = () => {
        logOutUser();
    }

    return (
        <>
            <UserProfileData userID={user.UserID} />
            <div className="user-messages">
                <FormElement  formTitle="Update Profile" endPoint={`users/${user.UserID}`} method="PATCH" passToEndPoint={ [{key: "UserID", value: user.UserID}] } submitButtonText="Update Profile" sections={ [forumUserNameSection, forumEmailSection] } />
            </div>

            <Link to="/"> { /* sends the user back to the landing page */ }
                <button onClick={ handleButtonPress } className="logout-button">Log out</button>
            </Link>
        </>
    );
}