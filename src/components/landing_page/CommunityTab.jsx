import { useState } from "react"
import { Link } from 'react-router-dom';
import commmunityIcon from "../../assets/commmunity-default-icon.svg"
import "./CommunityTab.css"

function CommunityTab( { communityName, friendCount, threadCount, forumIdentification } ) {
    const [count, setCount] = useState(0)
    const [id, setId] = useState(124325)

    let friends = null;
    let threads = null;

    if (friendCount != undefined) {
        friends = <> <h3 className="friend-count">{friendCount}</h3> <h3 className="friends-text">friends</h3></>
    } else {
        friends = <></>
    }

    if (threadCount != undefined) {
        threads = <><h3 className="thread-count">{threadCount}</h3><h3 className="thread-text">threads</h3></>
    } else {
        threads = <></>
    }

    return (
        <>
            <Link className="router-link" 
                to={ `/Forum/${ communityName.replace(/[ ]/g, "_") }` } 
                state={{ 
                    forumID: forumIdentification // this is how we pass along what forum we are viewing to the forumpage component 
                    // https://dev.to/gaurbprajapati/demystifying-uselocation-in-reactjs-a-beginners-guide-to-navigation-4h6f
                    // https://medium.com/@alexanie_/https-ocxigin-hashnode-dev-uselocation-hook-in-react-router-758a0a711308
                }}
            >
                <div className="community-tab">
                    <div className="community-icon">
                        <img src={commmunityIcon} alt="" className="community-icon-image" />
                    </div>
                    
                    <h2 className="community-name">{communityName}</h2>
                    <div className="community-friend-count community-stats">
                        { friends }
                    </div>
                    <div className="community-thread-count community-stats">
                        { threads }
                    </div>
                </div>
            </Link> 
        </>
    )
}

export default CommunityTab