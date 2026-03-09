import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const userId = 1;
  const currentUserId = 2;

  useEffect(() => {
    fetch(`http://localhost:5050/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("profile fetch error:", err));
  }, [userId]);

  useEffect(() => {
    fetch(
      `http://localhost:5050/api/follows/status?followerId=${currentUserId}&followingId=${userId}`
    )
      .then((res) => res.json())
      .then((data) => setIsFollowing(data.isFollowing))
      .catch((err) => console.error("follow status error:", err));
  }, [currentUserId, userId]);

  const loadFollowCounts = async () => {
    try {
      const followersRes = await fetch(
        `http://localhost:5050/api/users/${userId}/followers`
      );
      const followersData = await followersRes.json();
      setFollowersCount(Array.isArray(followersData) ? followersData.length : 0);

      const followingRes = await fetch(
        `http://localhost:5050/api/users/${userId}/following`
      );
      const followingData = await followingRes.json();
      setFollowingCount(Array.isArray(followingData) ? followingData.length : 0);
    } catch (err) {
      console.error("follow count error:", err);
    }
  };

  useEffect(() => {
    loadFollowCounts();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      setLoadingFollow(true);

      const res = await fetch("http://localhost:5050/api/follows", {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          follower_id: currentUserId,
          following_id: userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error || "Follow action failed");
        return;
      }

      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      await loadFollowCounts();
    } catch (err) {
      console.error("follow toggle error:", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (!user) {
    return <div style={{ padding: 20 }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>User Profile</h2>
      <p><strong>UserID:</strong> {user.UserID}</p>
      <p><strong>UserName:</strong> {user.UserName}</p>
      <p><strong>Email:</strong> {user.Email}</p>
      <p><strong>Role:</strong> {user.Role}</p>
      <p><strong>CreationDate:</strong> {String(user.CreationDate)}</p>
      <p><strong>Followers:</strong> {followersCount}</p>
      <p><strong>Following:</strong> {followingCount}</p>

      {currentUserId !== user.UserID && (
        <button
          onClick={handleFollowToggle}
          disabled={loadingFollow}
          style={{
            marginTop: "12px",
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          {loadingFollow
            ? "Processing..."
            : isFollowing
            ? "Unfollow"
            : "Follow"}
        </button>
      )}
    </div>
  );
}
