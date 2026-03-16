import { useEffect, useState } from "react";
import UserProfilePage from "./UserProfilePage.jsx"
import CurrentUserProfilePage from "./CurrentUserProfilePage.jsx";
import { useLocation } from 'react-router-dom';
import "./ProfilePage.css";

export default function ProfilePage() {
  // props passed through location state
  const currentUserID = useLocation().state.currentUserID;
  const userPageID = useLocation().state.userPageID;

  const [viewingOwnPage] = useState(currentUserID == userPageID);

  let content = (viewingOwnPage) ? <CurrentUserProfilePage currentUserID={currentUserID} /> : <UserProfilePage currentUserID={currentUserID} userPageID={userPageID} />;

  return (
    <>
      <div className="profile-page main-content">
        { content }
      </div>
    </>
  );
}