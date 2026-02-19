import { useState, useEffect } from "react"
import "./ThreadPage.css"
import ThreadPost from "./TheadPost"

function ThreadPage() {
    const [count, setCount] = useState(0)
    const [ThreadList, setThread] = useState([])
    useEffect(() => {
            fetch("http://localhost:5000/posts") // change later to not be on local host
            .then(response => response.json())
            .then(data => {
                setThread(data)
            }).catch(error => console.error(error));
        }, []);

  return (
    <>
        <div className="thread-page">
            <div className="thread-header">
                <div className="thread-name-count">
                    {/* <h1 className="thread-name">Topic Name</h1>
                    <h2 className="thread-post-count">10 Posts by 6 users</h2> */}
                </div>
                {/* <h2 className="thread-date">Thread started x days ago</h2> */}
            </div>
            {/* <ThreadPost key={10} {...postExampleOne} />
            <ThreadPost key={11} {...postExampleTwo} />
            <ThreadPost key={13} {...postExampleThree} />
            <ThreadPost key={14} {...postExampleFour} /> */}
            {ThreadList.map((post) => (
                        <ThreadPost key={post.PostID} Subject={post.subject} id={post.PostID} username={post.Creator} text={post.Content} likecount={post.likes} dislikecount={post.dislikes} timemade={post.Creation_Date} Status={post.Status} Replies={post.Replies}/>
                    ))}
        </div>
    </>
  )
}

export default ThreadPage