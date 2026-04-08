import { useEffect, useState, useContext } from "react";
import ConversationPanel from "../../messages_page/ConversationPanel.jsx";
import UserProfileData from "./UserProfileData.jsx";
import { UserContext } from "../../../contexts/Context.jsx";
import "./ProfilePage.css";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../../utility.js";

export default function UserProfilePage({ userData }) {
    let relationshipStates = ["Following", "Friends", "", "Follows you"]; // used if there is no blocking

    // the indices match relationshipStates if relationshipStates = following, the button text will be "Unfollow"
    let buttonText = ["Unfollow", "Unfriend", "Follow", "Friend"];

    const { user } = useContext(UserContext); // page viewer
    const [userInformation, setUserInformation] = useState(null);

    // false = neither user blocks the other
    // true = one of the users blocks the other
    const [pageOwnerBlocked, setPageOwnerBlocked] = useState(false); 
    const [pageViewerBlocked, setPageViewerBlocked] = useState(false); 

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

        let setBlocked = false;

        if (userFollowerRow) {
            if (userFollowerRow.Relationship == "Blocked") {
                setPageOwnerBlocked(true);
                setBlocked = true;
            }      
        } 
        
        if (userFollowedRow) {
           if (userFollowedRow.Relationship == "Blocked") {
                setPageViewerBlocked(true);
                setBlocked = true;
            }  
        }

        if (setBlocked) return;

        let relationIndex = 2;
        if (userFollowerRow && userFollowedRow) { // if userFollowerRow and userFollowedRow are not null and not blocked- with our current set up that means that they area friends
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

    const handleButtonPressFriend = () => {
        let endpoint = buttonText[relationshipIndex].toLowerCase();
        handleRelationshipChange(endpoint);
    };

    const handleButtonPressBlock = () => { 
        let body = {ReporterID: parseInt(user.UserID), ReporteeID: userInformation.UserID};
        let endPoint;
        let method;

        let replacingRelationshipWithBlock = relationshipStates[relationshipIndex] != ""; // if the users relationship state is not empty

        if (!pageOwnerBlocked && !replacingRelationshipWithBlock) {
            endPoint = "block";
            method = "POST";
        } else if (!pageOwnerBlocked && replacingRelationshipWithBlock) {
            endPoint = "block-friend";
            method = "PUT";
        } else if (pageOwnerBlocked) {
            endPoint = "unblock"
            method = "DELETE";
        };
        
        universalDatabaseInteraction(method, endPoint, body).then((data) => {
            if (data.successful) {
                setPageOwnerBlocked(!pageOwnerBlocked);
            }
        });
    };

    return (
        <div className="profile-container">
        <div className="profile-left-side">

            <UserProfileData userData={userData}/>
    
            <div className="relationship-elements">
                {/* <h2 className="user-relationship">
                    {relationshipStates[relationshipIndex]}
                </h2> */}

                <div className="button-list">
                    { (!pageOwnerBlocked && !pageViewerBlocked) && 
                        <button onClick={handleButtonPressFriend} className="user-follow-button">{buttonText[relationshipIndex]}</button>
                    }
                    <button onClick={handleButtonPressBlock} className="user-block-button">
                        { !pageOwnerBlocked &&
                            <p>Block</p>
                        }
                        { pageOwnerBlocked &&
                            <p>Unblock</p>
                        }
                    </button>
                </div>
            </div>

        </div>
        <div className="profile-right-side"> 
            { (userData.UserID && !pageOwnerBlocked && !pageViewerBlocked) && 
                <ConversationPanel userPageID={userData.UserID} />
            }
            
            { (pageOwnerBlocked || pageViewerBlocked) &&
                <div className="messaging-notice"><p>You cannot message this user</p></div>
            }
        </div>
        </div>
    );
}