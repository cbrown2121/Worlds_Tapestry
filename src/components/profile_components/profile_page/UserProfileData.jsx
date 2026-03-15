import { useEffect, useState } from "react";
import MessagesPage from "../messages_page/MessagesPage.jsx";
import "./ProfilePage.css";

export default function UserProfileData(props) {
    const [userID] = useState(props.userID);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userFollowerCount, setUserFollowerCount] = useState(null);
    const [userFollowingCount, setUserFollowingCount] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/user/${userID}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length == 1) {
                const userData = data[0];

                setUserName(userData.UserName);
                setUserEmail(userData.Email);
                setUserFollowerCount(userData.FollowerCount);
                setUserFollowingCount(userData.FollowingCount);
            }
        })
        .catch((err) => console.error("profile fetch error:", err));
    }, []);

    let content = (!userName || !userEmail) ? <div> Loading profile... </div> : 
            <>
                <h2>User Profile</h2>
                <div className="profile-row">
                    <p className="profile-label">Username: </p>
                    <p className="profile-content">{userName}</p>
                </div>
                <div className="profile-row">
                    <p className="profile-label">Email: </p>
                    <p className="profile-content">{userEmail}</p>
                </div>
                <div className="profile-row">
                    <p className="profile-label">Following: </p>
                    <p className="profile-content">{userFollowingCount}</p>
                </div>
                <div className="profile-row">
                    <p className="profile-label">Followers: </p>
                    <p className="profile-content">{userFollowerCount}</p>
                </div>
            </>

    return (
        <div className="user-profile-data">
            { content }
        </div>
    );
}