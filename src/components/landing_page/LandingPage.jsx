import { useState, useEffect } from "react";
import bookIcon from "../../assets/book-icon.svg";
import "./LandingPage.css";
import CommunityTab from "./CommunityTab";
import TrendingTab from "./TrendingTab";
import ForumCreationForum from "./ForumCreationForm";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";

// for now the "my communities" section is all the forums in our database

function LandingPage() {
    const [forumList, setForumList] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/forums")
        .then(response => response.json())
        .then(forumList => {
            addForumsToList(forumList);
        }).catch(error => console.error(error));
    }, []);

    const addForumsToList = (forumList) => {
        for (let i = forumList.length - 1; 0 <= i; i--) {
            if (forumList[i].SearchVisibility == "Hidden") {
                forumList.splice(i, 1); // remove elements from the list that are supposed to be private
            }
        }

        setForumList(forumList.reverse()); // reverse so most recent are on top. best for presenting currently
    }

    return (
        <>
            <Header/> { /* we could change it so the header and footer are just in the app page and then we have the routing. i guess i was just worried about some edge case */ }
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
                                <CommunityTab key={ forum.ForumID } communityName={ forum.ForumName } forumIdentification={ forum.ForumID } />
                            ))}
                        </div>
                    </div>
                </div>
            <Footer/>
        </>
    )
}

export default LandingPage