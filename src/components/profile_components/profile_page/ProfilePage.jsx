import { useEffect, useState, useContext } from "react";
import UserProfilePage from "./UserProfilePage.jsx"
import CurrentUserProfilePage from "./CurrentUserProfilePage.jsx";
import { useLocation } from 'react-router-dom';
import { UserContext } from "../../../contexts/Context.jsx";
import "./ProfilePage.css";
import { universalDatabaseFetch } from "../../../utility.js";

export default function ProfilePage() {

    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [viewingOwnPage, setViewingOwnPage] = useState(null);

    const imageBaseURL = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDNAME}/image/upload/`;

  // check if the user is in the post ratings list to see if they have already interacted with a post
    useEffect(() => {
        // uses the username to fetch data so we dont have to pass ids using the location state
        let username = location.pathname.substring(location.pathname.lastIndexOf("/") + 1, location.pathname.length);

        universalDatabaseFetch(`user-${username}`).then((data) => {
            if (data.successful) {
                if (data.result.length == 1) {
                    setUserData(data.result[0]);
                    setViewingOwnPage(user.UserID == data.result[0].UserID);
                }
            }
        });
    }, []);

//   let content = (viewingOwnPage) ? <CurrentUserProfilePage userData={userData} /> : <UserProfilePage userData={userData} />;

  return (
    <>
      <div className="profile-page main-content">
        { !userData &&
            <div className="loading-profile"><p>Currently loading profile...</p></div>
        }

        { userData && viewingOwnPage &&
            <CurrentUserProfilePage userData={userData} />
        }

        { userData && !viewingOwnPage &&
            <UserProfilePage userData={userData}/>
        }
      </div>
    </>
  );
}