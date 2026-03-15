import { useEffect, useState } from "react";
import FormElement from "../../form_component/FormElement.jsx";
import UserProfileData from "./UserProfileData.jsx";
import "./ProfilePage.css";

export default function CurrentUserProfilePage(props) {
    // props: currentUserID
    const [currentUserID, setUser] = useState(props.currentUserID);

    let forumUserNameSection = { type: "text", sectionTitle: "Username", sectionID:"UserName" };
    let forumEmailSection = { type: "text", sectionTitle: "Email", sectionID:"Email" };

    return (
        <>
            <UserProfileData userID={currentUserID} />
            <div className="user-messages">
                <FormElement  formTitle="Update Profile" endPoint={`users/${currentUserID}`} method="PATCH" passToEndPoint={ [{key: "UserID", value: currentUserID}] } submitButtonText="Update Profile" sections={ [forumUserNameSection, forumEmailSection] } />
            </div>
        </>
    );
}