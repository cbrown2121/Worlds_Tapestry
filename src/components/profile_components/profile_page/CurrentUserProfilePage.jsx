import { useEffect, useState, useContext } from "react";
import FormElement from "../../form_component/FormElement.jsx";
import UserProfileData from "./UserProfileData.jsx";
import { UserContext } from "../../../contexts/Context.jsx";
import "./ProfilePage.css";
import { Link } from "react-router-dom";

export default function CurrentUserProfilePage() {
    const { user, logOutUser } = useContext(UserContext);
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [message, setMessage] = useState("");

    const bucketBaseURL = "https://world-tapestry-s3.s3.amazonaws.com/";

    const avatars = [
        "avatar1.png",
        "avatar2.png",
        "avatar3.png",
        "avatar4.png",
        "avatar5.png",
        "avatar6.png",
        "avatar7.png",
        "avatar8.png",
        "avatar9.png",
        "avatar10.png"
    ];

    let forumUserNameSection = { type: "text", sectionTitle: "Username", sectionID:"UserName" };
    let forumEmailSection = { type: "text", sectionTitle: "Email", sectionID:"Email" };

    const handleButtonPress = () => {
        logOutUser();
    }

    const handleSaveAvatar = async () => {
        if (!selectedAvatar) {
            setMessage("Please select an avatar");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/users/${user.UserID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ProfilePicture: selectedAvatar
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to update avatar");
                return;
            }

            setMessage("Avatar updated successfully");
            window.location.reload();
        } catch (error) {
            console.error("Avatar update failed:", error);
            setMessage("Server error while updating avatar");
        }
    };

    return (
        <>
            <UserProfileData userID={user.UserID} />
            <div className="user-messages">
                <FormElement  formTitle="Update Profile" endPoint={`users/${user.UserID}`} method="PATCH" passToEndPoint={ [{key: "UserID", value: user.UserID}] } submitButtonText="Update Profile" sections={ [forumUserNameSection, forumEmailSection] } />
            </div>

            <div className="user-messages">
                <h2>Select Avatar</h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 80px)",
                        gap: "12px",
                        marginTop: "10px",
                        marginBottom: "15px"
                    }}
                >
                    {avatars.map((avatar) => (
                        <img
                            key={avatar}
                            src={`${bucketBaseURL}${avatar}`}
                            alt={avatar}
                            onClick={() => setSelectedAvatar(avatar)}
                            style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                border: selectedAvatar === avatar ? "3px solid blue" : "1px solid gray",
                                padding: "2px"
                            }}
                        />
                    ))}
                </div>

                <button onClick={handleSaveAvatar}>
                    Save Avatar
                </button>

                {message && <p>{message}</p>}
            </div>         

            <Link to="/"> { /* sends the user back to the landing page */ }
                <button onClick={ handleButtonPress } className="logout-button">Log out</button>
            </Link>
        </>
    );
}