import { useEffect, useState, useContext } from "react";
import ConversationPanel from "../../messages_page/ConversationPanel.jsx";
import UserProfileData from "./UserProfileData.jsx";
import { UserContext } from "../../../contexts/Context.jsx";
import "./ProfilePage.css";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../../utility.js";

export default function UserProfilePage({ userData }) {
    let relationshipStates = ["Following", "Friends", "", "Follows you"];

    // the indices match relationshipStates if relationshipStates = following, the button text will be "Unfollow"
    let buttonText = ["Unfollow", "Unfriend", "Follow", "Friend"];

    const { user } = useContext(UserContext); // page viewer
    const [userInformation, setUserInformation] = useState(null);

    const [relationshipIndex, setRelationshipIndex] = useState(3);

    const invertRelationship = () => { // if the user pressed the follow/unfollow/friend/unfriend, the relationship will change to the inverse
        // following => ""
        // friends => follows you
        // follows you => friend
        // "" => following

        // a specific order is used so the index + 2 will be the reverse (you need to wrap around though for if the index goes over 4)
        setRelationshipIndex((relationshipIndex + 2) % relationshipStates.length);
    }

    const processUserRelationship = (userRelationshipData) => {
        let userFollowerRow = userRelationshipData.find((row) => row.FollowingUser == user.UserID) || null; // if the user follows the page
        let userFollowedRow = userRelationshipData.find((row) => row.FollowedUser == user.UserID) || null; // if the page follows the user

        let relationIndex = 2;
        if (userFollowerRow && userFollowedRow) { // if userFollowerRow and userFollowedRow are not null- with our current set up that means that they area friends
            relationIndex = 1;
        } else if (userFollowerRow) { // user follows page
            relationIndex = 0;
        } else if (userFollowedRow) { // page follows user
            relationIndex = 3;
        }

        setRelationshipIndex(relationIndex);
    }

    useEffect(() => {
        setUserInformation(userData);

        universalDatabaseFetch(`relationship/${user.UserID}/${userData.UserID}`).then((data) => {
            if(data.successful) {
                processUserRelationship(data.result);
            }
        });
    }, [userData]);

    const handleRelationshipChange = async (endpoint) => {
        let body = {FollowerID: user.UserID, FolloweeID: userInformation.UserID};

        universalDatabaseInteraction("POST", endpoint, body).then((data) => {
            if (data.successful) {
                invertRelationship();
            } else {
                console.log(data);
            }
        });
    }

    const handleButtonPress = () => { // sorry this is a mess
        let endpoint = buttonText[relationshipIndex].toLowerCase();
        handleRelationshipChange(endpoint);
    };

    return (
        <div className="profile-container">
        <div className="profile-left-side">

            <UserProfileData userData={userData}/>
    
            <div className="relationship-elements">
            <h2 className="user-relationship">
                {relationshipStates[relationshipIndex]}
            </h2>

            <button onClick={handleButtonPress} className="user-follow-button">{buttonText[relationshipIndex]}</button>
            </div>

        </div>
        <div className="profile-right-side"> 
            { userData.UserID &&
                <ConversationPanel userPageID={userData.UserID} />
            }
        </div>
        </div>
    );
}