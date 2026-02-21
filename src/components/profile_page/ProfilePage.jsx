import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const userId = "U100000"; // demo user

  useEffect(() => {
    fetch(`http://localhost:5000/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <div style={{ padding: 20 }}>Loading profile...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>User Profile</h2>
      <p><strong>UserID:</strong> {user.UserID}</p>
      <p><strong>UserName:</strong> {user.UserName}</p>
      <p><strong>Email:</strong> {user.Email}</p>
      <p><strong>Role:</strong> {user.Role}</p>
      <p><strong>CreationDate:</strong> {user.CreationDate}</p>
    </div>
  );
}

