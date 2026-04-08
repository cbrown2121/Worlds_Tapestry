import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import "./ThreadContent.css";
import ThreadPost from "./TheadPost.jsx";
import FormElement from "../../../form_component/FormElement.jsx";
import { UserContext } from "../../../../contexts/Context.jsx";
import { Link } from "react-router-dom";
import { universalDatabaseFetch } from "../../../../utility.js";

function ThreadContent(props) {
    const state = useLocation().state;

    const { user } = useContext(UserContext);
    const [threadID, setThreadID] = useState(state.threadID);
    const [threadName, setThreadName] = useState(state.threadName);
    const [posts, setPosts] = useState([]);
    const [fillingOutForm, setFormState] = useState(false);

    useEffect(() => {
        universalDatabaseFetch(`posts/${threadID}`).then((data) => {
            setPosts(data);
        });
    }, []);

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


            <FormElement formTitle="Add to the discussion" method="POST" endPoint="posts" passToEndPoint={ [{key: "creator", value: user.UserID}, {key: "thread_id", value: threadID}] }>
                <textarea name="content" id="content"></textarea>
                <button type="submit" className="create-post">Create Post</button>
            </FormElement>

        </div>
    </>
  )
}

export default ThreadContent;