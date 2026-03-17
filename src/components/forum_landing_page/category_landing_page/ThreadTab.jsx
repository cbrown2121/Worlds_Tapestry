import { useState, useEffect } from "react";
import categoryImage from "../../../assets/commmunity-default-icon.svg";
import { calculateRecency } from "../../../utility.js";
import { Link } from 'react-router-dom';
// import "../";
import { useLocation } from 'react-router-dom';

function ThreadTab( props ) {
    const location = useLocation();
    const [recency, setRecency] = useState(null);
    const [forumName] = useState(props.ForumName);
    const [categoryName] = useState(props.CategoryName);

    useEffect(() => {
        setRecency(calculateRecency(props.MostRecentPost))
    },[]);

    return (
        <>
            <Link className="router-link" 
                    to={ `/Forum/${ forumName.replace(/[ ]/g, "_") }/Category/${ categoryName.replace(/[ ]/g, "_") }/thread/${props.ThreadName.replace(/[ ]/g, "_")}` }  // change later so this includes the forum name from the previous link
                    state={{ 
                        threadID: props.ThreadID
                    }}
            >

            <div className="tab thread-tab">
                    <div className="icon-or-image"></div>

                    <div className="tab-information">
                        <div className="tab-name-text">
                            {props.ThreadName}
                        </div>
                        {/* <div className="category-description">
                            <p className="category-description-text">{props.Description}</p>
                        </div> */}
                    </div>

                    <div className="tab-stats">    
                            <div className="tab-stats-numbers">
                                <div className="post-count">
                                    <p className="number-of-posts">{props.NumberOfPosts}</p>
                                        { props.NumberOfPosts != 1 && 
                                        <>Posts</>
                                        } 

                                        { props.NumberOfPosts == 1 && 
                                        <>Post</>
                                        } 
                                </div>
                            </div>
                            <div className="most-recent-activity">
                                { recency != null &&
                                    <p className="most-recent">Recent Activity {recency}</p>
                                } 
                            </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default ThreadTab