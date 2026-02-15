import { useState, useEffect } from "react"
import bookIcon from "../../assets/book-icon.svg"
import compassIcon from "../../assets/compass-icon.svg"
import map from "../../assets/map.png"
import "./LandingPage.css"
import CommunityTab from "./CommunityTab"
import TrendingTab from "./TrendingTab"
import ForumCreationForum from "./ForumCreationForm"

// for now the "my communities" section is all the forums in our database

function LandingPage() {
    const [forumList, setForumList] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/forums") // change later to not be on local host
        .then(response => response.json())
        .then(forumList => {
            fetch("http://localhost:5000/forumsettings") // merge forum and forum settings (or at least put forum visiblity in the forum table) to avoid all this
            .then(response => response.json())
            .then(forumPrivacy => {
                addForumsToList(forumList, forumPrivacy);
                setForumList(forumList);
            }).catch(error => console.error(error));

        }).catch(error => console.error(error));
    }, []);

    const addForumsToList = (forumList, privacyList) => { // this is a mess. sorry
        console.log(forumList)

        for (let i = forumList.length - 1; 0 <= i; i--) {
            if (privacyList[i].SearchVisibility == "Hidden") {
                forumList.splice(i, 1); // remove elements from the list that are supposed to be private
            }
        }
    }

    return (
        <>
        <div id="landing-page">
            <div id="landing-left">
                <ForumCreationForum/> 
                <div id="trending-column">
                    <TrendingTab trendingTitle="Popular Community of the Day" trendingCommunity="Community Name" trendingDetails="details..."/>
                    <TrendingTab trendingTitle="Popular Thread of the Day" trendingCommunity="Community Name" trendingDetails="details..."/>
                </div>
                {/* <div id="map">
                    <div id="my-map-heading">
                        <img src={compassIcon} alt="" id="my-map-icon" />
                        <h1 id="my-map-text">My Map</h1>
                    </div>

                    <img src={map} alt="" id="map-image" />
                    
                </div> */}
            </div>
            <div id="landing-right">
                <div id="my-communities-header">
                    <img id="my-communities-header-icon" src={bookIcon} alt="" />
                    <h1 id="my-communities-header-text" >Communities</h1>
                </div>
                
                <div id="my-communities">
                    {forumList.map((forum) => (
                        <CommunityTab key={forum.ForumId} communityName={forum.ForumName}/>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default LandingPage