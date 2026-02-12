import { useState } from "react"
import commmunityIcon from "../../assets/commmunity-default-icon.svg"
import "./CommunityTab.css"

function CommunityTab( { communityName, friendCount, threadCount } ) {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="community-tab">
            <div className="community-icon">
                <img src={commmunityIcon} alt="" className="community-icon-image" />
            </div>
            
            <h2 className="community-name">{communityName}</h2>
            <div className="community-friend-count community-stats">
                <h3 className="friend-count">{friendCount}</h3>
                <h3 className="friends-text">friends</h3>
            </div>
            <div className="community-thread-count community-stats">
                <h3 className="thread-count">{threadCount}</h3>
                <h3 className="thread-text">threads</h3>
            </div>
        </div>
    </>
  )
}

export default CommunityTab