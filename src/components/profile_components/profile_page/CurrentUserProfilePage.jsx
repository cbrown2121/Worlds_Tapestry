import { useEffect, useState, useContext } from "react";
import FormElement from "../../form_component/FormElement.jsx";
import UserProfileData from "./UserProfileData.jsx";
import { UserContext } from "../../../contexts/Context.jsx";
import "./ProfilePage.css";
import { Link } from "react-router-dom";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../../utility.js";
import FormTextSection from "../../form_component/FormTextSection.jsx";

export default function CurrentUserProfilePage({ userData }) {
    const { user, logOutUser } = useContext(UserContext);
    const [message, setMessage] = useState("");

    const imageBaseURL = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDNAME}/image/upload/`;

    const handleButtonPress = () => {
        logOutUser();
    }

    // https://cloudinary.com/documentation/javascript_image_and_video_upload
    const uploadPhoto = async (event) => {
        event.preventDefault();
        let file = event.target.childNodes[0].files[0];

        let cloudName = import.meta.env.VITE_CLOUDNAME;

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", "Worlds_Tapestry");

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        await response.json().then((data) => {
            let body = {"UserID" : user.UserID, "ProfilePicture": `${data.public_id}.${data.format}`};

            universalDatabaseInteraction("put", "user-image", body).then((result) => {
                if (result.successful)  window.location.reload(); // reload window to show data change
            });
        });
    }

    return (
        <>
            { userData &&
                <UserProfileData userData={userData} />
            }
            <div className="user-settings">
                <FormElement updateUserInformation={true} formTitle="Update Profile" endPoint={`users/${user.UserID}`} method="PATCH" passToEndPoint={ [{key: "UserID", value: user.UserID}] }>
                    <FormTextSection type="text" sectionTitle="Username" sectionID="UserName" />
                    <FormTextSection type="text" sectionTitle="Email" sectionID="Email" />
                    <button type="submit" className="user-profile-update-button">Update Profile</button>
                </FormElement>
            </div>

            <div className="user-profile">
                <h2>Upload a profile image</h2>
                <div>
                    <form onSubmit={uploadPhoto} action="">
                        <input type="file" name="userProfile" id="userProfile" accept="image/png, image/jpeg, image/jpg" />
                        <button type="submit" >Upload</button>
                    </form>
                </div>

                {message && <p>{message}</p>}
            </div>         

            <Link to="/"> 
                <button onClick={ handleButtonPress } className="logout-button">Log out</button>
            </Link>
        </>
    );
}