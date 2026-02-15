import { useState } from "react"
import "./ThreadPage.css"
import ThreadPost from "./TheadPost"

function ThreadPage() {
    const [count, setCount] = useState(0)

  return (
    <>
        <div className="thread-page">
            <div className="thread-header">
                <div className="thread-name-count">
                    <div className="thread-name">Topic Name</div>
                    <div className="thread-post-count">10 Posts by 6 users</div>
                </div>
                <div className="thread-date">Thread started x days ago</div>
            </div>

        </div>
    </>
  )
}

export default ThreadPage