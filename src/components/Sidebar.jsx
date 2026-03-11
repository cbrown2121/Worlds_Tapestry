import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// import logo from "../assets/logo_clear.png"
// import messageIcon from "../assets/message-icon.svg"
// import profileIcon from "../assets/profile.svg"
// import SearchBar from "./SearchBar.jsx"

const Sidebar = ( props ) => { // currently this runs twice because there is a left and right sidebar for spacing reasons- itll be fixed later
  const sampleUserID = 1;
  const [forumList, setForumList] = useState([]);

  useEffect(() => {
      fetch(`http://localhost:5000/usersforums/${sampleUserID}`) // get original thread posts from all forums the user is in
      .then(response => response.json())
      .then(forums => {
          if (props.id == "sidebar-left") setForumList(forums);
      }).catch(error => console.error(error));
  }, []);

  const startForumCreation = () => {

  }

  return (
    <>
      <div id={ props.id } className="sidebar">
        <div className="forum-list">
          <p>Followed Forums: </p>
          {forumList.map((forum) => {
            return  <Link key={ `${forum.ForumID}-${forum.ForumName}` } className="router-link" 
                      to={ `/Forum/${ forum.ForumName.replace(/[ ]/g, "_") }` } 
                      state={{ 
                          forumID: forum.ForumID,
                          forumName: forum.ForumName
                      }}
                    >
                      <h1> {forum.ForumName} </h1>
                    </Link>
            })}
        </div>

        {/* <button onClick={startForumCreation} id="create-forum-button" >Create Community</button> */}
      </div>
    </>
  )
}

export default Sidebar