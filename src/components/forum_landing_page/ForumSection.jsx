import { useState } from "react"
import "./ForumSection.css"

// categoryTabs should be an array of components
function ForumSection( { title, categoryTabsList } ) {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="forum-section">
            <div className="forum-section-title">{title}</div>
            { categoryTabsList }
        </div>
        
    </>
  )
}

export default ForumSection