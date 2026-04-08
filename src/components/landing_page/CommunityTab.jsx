import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { calculateRecency } from "../../utility.js";
import commmunityIcon from "../../assets/commmunity-default-icon.svg"

function CommunityTab( props ) {
    const [recency, setRecency] = useState(null);
    
    useEffect(() => {
        setRecency(calculateRecency(props.MostRecentActivity));
    },[]);

    return (
        <>
            <Link className="router-link" 
                to={ `/Forum/${ props.ForumName }` } 
                state={{ 
                    forumID: props.ForumID, // this is how we pass along what forum we are viewing to the forumpage component 
                    // https://dev.to/gaurbprajapati/demystifying-uselocation-in-reactjs-a-beginners-guide-to-navigation-4h6f
                    // https://medium.com/@alexanie_/https-ocxigin-hashnode-dev-uselocation-hook-in-react-router-758a0a711308
                    forumName: props.ForumName,
                    forumMap: props.AllowMaps,
                    forumTags: props.Tags
                }}
            >

                <div className="tab landing-tab">

                    <div className="tab-information">
                        <div className="tab-name">{props.ForumName}</div>
                        { recency != null &&
                            <p className="most-recent">Recent Activity {recency}</p>
                        }
                    </div>
                </div>

                {/* <div className="community-tab">
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
                </div> */}
            </Link> 
        </>
    )
}

export default CommunityTab