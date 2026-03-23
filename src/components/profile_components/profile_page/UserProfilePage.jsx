import { useEffect, useState, useContext } from "react";
import MessagesPage from "../messages_page/MessagesPage.jsx";
import UserProfileData from "./UserProfileData.jsx";
import Icon from "../../../assets/profile.svg"
import { UserContext } from "../../../contexts/Context.jsx";
import "./ProfilePage.css";

export default function UserProfilePage(props) {
  // props: currentUserID (user viewing page) userPageID (users page)

  const [pageOwnerID] = useState(props.userPageID);
  const { user } = useContext(UserContext); // page viewer

  const [relationship, setRelationship] = useState(false);
  const [followButtonText, setFollowButtonText] = useState(false);

  const relationshipFromRow = (relationshipData) => {
      const followerID = relationshipData.FollowingUser;
      const followingID = relationshipData.FollowedUser;

      if (followerID == user.UserID && followingID == pageOwnerID) { // viewer follows owner
        setFollowButtonText("Unfollow");
        return "You follow this user";
      }

      if (followerID == pageOwnerID && followingID == user.UserID) { // owner follows user
        setFollowButtonText("Follow");
        return "This user follows you";
      }
  }

  const processUserRelationship = (userRelationshipData) => {
    const relationshipDataLength = userRelationshipData.length;

    if (relationshipDataLength == 0) { // no relationship
      setRelationship("");
    } else if (relationshipDataLength == 1) { // relationship is one way
      setRelationship(relationshipFromRow(userRelationshipData[0]));
    } else if (relationshipDataLength == 2) { // relationship is two way
      let relationshipOne = relationshipFromRow(userRelationshipData[0]);
      let relationshipTwo = relationshipFromRow(userRelationshipData[1]);

      if (relationshipOne != relationshipTwo) { // should maybe check a bit more throughly 
        setFollowButtonText("Unfollow");
        setRelationship("You and this user follow eachother");
      } 
    }
  }

  useEffect(() => {
    fetch(`http://localhost:5000/relationship/${user.UserID}/${pageOwnerID}`)
    .then((res) => res.json())
    .then((data) => {
      processUserRelationship(data);
    })
    .catch((err) => console.error("profile fetch error:", err));
  }, []);

  const handleRelationshipChange = async (endpoint, newButtonText, newRelationshipText) => {
    let data = {FollowerID: user.UserID, FolloweeID: pageOwnerID};

    try {
        const response = await fetch(`http://localhost:5000/${endpoint}`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Network response error");
        } else {
          setFollowButtonText(newButtonText);
          setRelationship(newRelationshipText);
        }
    } catch (error) {
        console.log(`Data was submitted unsuccessfully: ${error}`);
    }
  }

  const handleButtonPress = () => { // sorry this is a mess
    let userFollowsViewer = (relationship == "You and this user follow eachother" || relationship == "This user follows you");
    let endpoint = followButtonText.toLowerCase();

    let newButtonText = (endpoint == "follow") ? "Unfollow" : "Follow";
    let newRelationshipText = "";

    if (userFollowsViewer) {
      endpoint += "-mutual";

      if (followButtonText == "Follow") { // user is following someone that does not follow them
        newRelationshipText = "You and this user follow eachother";
      } else { // user is unfollowing someone that does not follow them
        newRelationshipText = "This user follows you";
      }
    } else {
      if (followButtonText == "Unfollow") { // user is following someone that does not follow them
        newRelationshipText = "You follow this user";
      }
    }

    handleRelationshipChange(endpoint, newButtonText, newRelationshipText);
  };

  return (
    <div className="profile-container">
      <div className="profile-left-side">

        <img src={Icon} alt="" className="user-profile-image" />
        <UserProfileData userID={pageOwnerID} viewer={"user"} />

        <div className="relationship-elements">
          <h2 className="user-relationship">
            {relationship}
          </h2>

          <button onClick={handleButtonPress} className="user-follow-button">{followButtonText}</button>
        </div>

      </div>
      <div className="profile-right-side">
        <MessagesPage currentUserID={user.UserID} userPageID={pageOwnerID} />
      </div>
    </div>
  );
}