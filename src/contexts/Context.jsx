import { createContext, useState } from 'react';

// https://www.geeksforgeeks.org/reactjs/how-to-set-cookie-in-reactjs/
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const setCookie = (name, value, maxAge) => {
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
}

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setStateUser] = useState({ UserID: getCookie("WP-userID"), UserName: getCookie("WP-username") });

  const setUser = (userData) => {
    setStateUser({ UserID: userData.UserID, UserName: userData.UserName });

    // 1 Day = 24 Hrs = 24*60*60 = 86400.
    let maxAge = (24 * 3) * 60 * 60; // three days

    setCookie("WP-userID", userData.UserID, maxAge);
    setCookie("WP-username", userData.UserName, maxAge);
  }

  const logOutUser = () => {
    setStateUser({ UserID: null, UserName: null });
    deleteCookie("WP-userID");
    deleteCookie("WP-username");
  }

  const loggedIn = () => {
    return user.UserID !== null && user.UserName !== null;
  }

  return (
    <UserContext.Provider value={{ user, setUser, logOutUser, loggedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export const ForumContext = createContext();

export const ForumProvider = ({ children }) => {
  const [forum, setForumState] = useState(null);

  const setForum = (forumData) => {
    setForumState(forumData);
  }

  return (
    <ForumContext.Provider value={{ forum, setForum }}>
      {children}
    </ForumContext.Provider>
  );
}