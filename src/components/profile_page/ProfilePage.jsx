import { useEffect, useState } from "react";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import MessagesPage from "../messages_page/MessagesPage.jsx";
import "./ProfilePage.css"
import FormElement from "../form_component/FormElement.jsx";
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

  let forumUserNameSection = { type: "text", sectionTitle: "Username", sectionID:"UserName" };
  let forumEmailSection = { type: "text", sectionTitle: "Email", sectionID:"Email" };

  return (
    <>
        <div className="profile-page main-content">
          <div className="profile-container">
            <h2>User Profile</h2>
            <p><strong>UserID:</strong> {user.UserID}</p>
            <p><strong>UserName:</strong> {user.UserName}</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>CreationDate:</strong> {user.CreationDate}</p>
          </div>

        <FormElement  formTitle="Create A Forum" endPoint={`users/${userId}`} method="PATCH" passToEndPoint={ [{key: "UserID", value: userId}] } submitButtonText="Update Profile" sections={ [forumUserNameSection, forumEmailSection] } />
        <MessagesPage/>
        </div>
    </>
  )
}