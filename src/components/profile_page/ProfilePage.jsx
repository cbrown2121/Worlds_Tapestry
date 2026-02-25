import { useEffect, useState } from "react";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import MessagesPage from "../messages_page/MessagesPage.jsx";
import "./ProfilePage.css"
import ProfileUpdateForm from "./ProfileUpdateForm.jsx";
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const userId = "1"; // demo user
  useEffect(() => {
    fetch(`http://localhost:5000/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <div style={{ padding: 20 }}>Loading profile...</div>;

  return (
    <>
      <Header/>
        <div className="profile-page">
          <div className="profile-container">
            <h2>User Profile</h2>
            <p><strong>UserID:</strong> {user.UserID}</p>
            <p><strong>UserName:</strong> {user.UserName}</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>Role:</strong> {user.Role}</p>
            <p><strong>CreationDate:</strong> {user.CreationDate}</p>
          </div>
          <ProfileUpdateForm userID = {userId}/>
        <MessagesPage/>
        </div>
      <Footer/> 
    </>
  )
}

