import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import "./ThreadContent.css";
import ThreadPost from "./TheadPost.jsx";
import FormElement from "../../../form_component/FormElement.jsx";
import { UserContext } from "../../../../contexts/Context.jsx";
import { Link } from "react-router-dom";

function ThreadContent(props) {
    const state = useLocation().state;

    const { user } = useContext(UserContext);
    const [threadID, setThreadID] = useState(state.threadID);
    const [threadName, setThreadName] = useState(state.threadName);
    const [posts, setPosts] = useState([]);
    const [ThreadList, setThread] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/posts/${threadID}`)
        .then(response => response.json())
        .then(postList => {
            setPosts(postList);
        }).catch(error => console.error(error));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const userId = props.userID; // demo user

        let userData = { creator : user.UserID, thread_id : threadID, content : formData.get("postbody") }
        
        try {
            const response = await fetch(`http://localhost:5000/posts`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

            const result = await response.json();
            console.log(`Data was submitted successfully: ${userData}`);

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }

        window.location.reload(); // reload window to show that profile has been updated.
    }

    let forumTextSection = { type: "text", sectionTitle: "Post Content", sectionID:"content" };

  return (
    <>
        <div className="thread-page main-content">
            <div className="thread-header">
                <div className="thread-name-count">
                    <h1 className="thread-name">{threadName}</h1>
                    <h2 className="thread-post-count">{posts.length} Posts</h2>

                    <Link key={ `${threadID}-${threadName}-report` } className="router-link" 
                        to={ `/Report-Content` } 
                        state={{ 
                            reportedID: threadID,
                            reportedName: threadName,
                            type: "Thread"
                        }}
                    >
                        <button className="report-thread-button" > Report Thread </button>
                    </Link>
                </div>

                <div id="profile-update">
            </div>
            </div>
            {posts.map((post, index) => {
                if (post.Deleted) {
                    return  <div key={index} className="deleted-post thread-post">
                                <p>This post was deleted by the user.</p>
                            </div>
                } else {
                    return <ThreadPost key={index} {...post}/>;
                }
            })}

            <FormElement  formTitle="Add to the discussion" method="POST" endPoint="posts" passToEndPoint={ [{key: "creator", value: user.UserID}, {key: "thread_id", value: threadID}] } submitButtonText="Create Post" sections={ [forumTextSection] } />
        </div>
    </>
  )
}

export default ThreadContent