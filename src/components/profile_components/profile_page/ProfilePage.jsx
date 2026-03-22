import { useEffect, useState, useContext } from "react";
import UserProfilePage from "./UserProfilePage.jsx"
import CurrentUserProfilePage from "./CurrentUserProfilePage.jsx";
import { useLocation } from 'react-router-dom';
import { UserContext } from "../../../contexts/Context.jsx";
import "./ProfilePage.css";

export default function ProfilePage() {
  // props passed through location state
  const { user } = useContext(UserContext);
  const userPageID = useLocation().state.userPageID;

  const [viewingOwnPage] = useState(user.UserID == userPageID);

  let content = (viewingOwnPage) ? <CurrentUserProfilePage /> : <UserProfilePage userPageID={userPageID} />;

  return (
    <>
      <div className="profile-page main-content">
        { content }
      </div>
    </>
  );
}