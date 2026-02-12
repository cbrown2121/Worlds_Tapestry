import { useState } from "react"
import bookIcon from "../../assets/book-icon.svg"
import compassIcon from "../../assets/compass-icon.svg"
import map from "../../assets/map.png"
import "./LandingPage.css"
import CommunityTab from "./CommunityTab"
import TrendingTab from "./TrendingTab"

function LandingPage() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div id="landing-page">
        <div id="landing-left">
            <div id="trending-column">
                <TrendingTab trendingTitle="Popular Community of the Day" trendingCommunity="Community Name" trendingDetails="details..."/>
                <TrendingTab trendingTitle="Popular Thread of the Day" trendingCommunity="Community Name" trendingDetails="details..."/>
            </div>
            <div id="map">
                <div id="my-map-heading">
                    <img src={compassIcon} alt="" id="my-map-icon" />
                    <h1 id="my-map-text">My Map</h1>
                </div>

                <img src={map} alt="" id="map-image" />
                
            </div>
        </div>
        <div id="landing-right">
            <div id="my-communities-header">
                <img id="my-communities-header-icon" src={bookIcon} alt="" />
                <h1 id="my-communities-header-text" >My Communities</h1>
            </div>
            
            <div id="my-communities">
                <CommunityTab communityName="Community Name" friendCount="x,xxx" threadCount="x,xxx"/>
                <CommunityTab communityName="Community Name" friendCount="x,xxx" threadCount="x,xxx"/>
                <CommunityTab communityName="Community Name" friendCount="x,xxx" threadCount="x,xxx"/>
                <CommunityTab communityName="Community Name" friendCount="x,xxx" threadCount="x,xxx"/>
                <CommunityTab communityName="Community Name" friendCount="x,xxx" threadCount="x,xxx"/>
            </div>
        </div>
       </div>
    </>
  )
}

export default LandingPage