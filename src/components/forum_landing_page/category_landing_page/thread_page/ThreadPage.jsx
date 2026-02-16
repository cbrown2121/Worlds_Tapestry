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
    // change default keys later
    // let postExampleOne = { subject: "New Post", text: "Hello there I am a new user you all suck.", likecount: 5, dislikecount: 0, username: "username"}
    // let postExampleTwo = { subject: "Re: New Post", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex magni perspiciatis dolorum, dolorem at, ducimus nostrum et ullam, qui nobis nihil sapiente dolor adipisci aut dignissimos! Animi odio ipsa cum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit, itaque. Sit earum necessitatibus mollitia unde est fuga omnis accusantium porro eaque voluptate, exercitationem modi officia illo facilis natus voluptatem doloribus.", likecount: 12, dislikecount: 5, username: "username"}
    // let postExampleThree = { subject: "Re: New Post", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex magni perspiciatis dolorum, dolorem at, ducimus nostrum et ullam, qui nobis nihil sapiente dolor adipisci aut dignissimos! Animi odio ipsa cum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit, itaque. Sit earum necessitatibus mollitia unde est fuga omnis accusantium porro eaque voluptate, exercitationem modi officia illo facilis natus voluptatem doloribus.", likecount: 3, dislikecount: 21, username: "username"}
    // let postExampleFour = { subject: "Re: Re: New Post", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex magni perspiciatis dolorum, dolorem at, ducimus nostrum et ullam, qui nobis nihil sapiente dolor adipisci aut dignissimos! Animi odio ipsa cum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit, itaque. Sit earum necessitatibus mollitia unde est fuga omnis accusantium porro eaque voluptate, exercitationem modi officia illo facilis natus voluptatem doloribus.", likecount: 80, dislikecount: 9, username: "username"}

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
                        <ThreadPost key={post.PostID} subject={post.subject} id={post.PostID} username={post.Creator} text={post.Content} likecount={post.likes} dislikecount={post.dislikes} timemade={post.Creation_Date}/>
                    ))}
        </div>
    </>
  )
}

export default ThreadPage