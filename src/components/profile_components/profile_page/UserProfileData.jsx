import { useContext, useEffect, useState } from "react";
import MessagesPage from "../../messages_page/ConversationPanel.jsx";
import "./ProfilePage.css";
import { UserContext } from "../../../contexts/Context.jsx";

export default function UserProfileData({ userData }) {
    const { user, logOutUser } = useContext(UserContext); // person viewing page

    const [userID] = useState(userData.UserID);
    const [userName] = useState(userData.UserName);
    const [userEmail] = useState(userData.Email);
    const [userFollowerCount] = useState(userData.FollowerCount);
    const [userFollowingCount] = useState(userData.FollowingCount);
    const [profilePicture] = useState(userData.ProfilePicture);

    const imageBaseURL = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDNAME}/image/upload/`;

    let content = (!userName || !userEmail) ? <div> Loading profile... </div> : 
            <>
                <div className="profile-row">
                    <p className="profile-content">{userName}</p>
                    <img className="user-profile-image" src={ `${imageBaseURL}${profilePicture}` } alt="" />
                </div>
                { user.UserID == userID &&
                    <div className="profile-row">
                        <p className="profile-content">{userEmail}</p>
                    </div>
                }
                <div className="profile-row">
                    <div className="profile-row">
                        <p className="profile-label">Following: </p>
                        <p className="profile-content">{userFollowingCount}</p>
                    </div>
                    <div className="profile-row">
                        <p className="profile-label">Followers: </p>
                        <p className="profile-content">{userFollowerCount}</p>
                    </div>
                </div>
            </>

    return (
        <div className="user-profile-data">
            { content }
        </div>
    );
}