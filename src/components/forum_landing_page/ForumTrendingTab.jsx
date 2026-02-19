import { useState } from "react"
import trendingImage from "../../assets/commmunity-default-icon.svg"
import "./ForumTrendingTab.css"

function ForumTrendingTab( {trendingTitle, trendingName, trendingDetails} ) {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="fourm-trending">
            <h1 className="fourm-trending-label">{trendingTitle}</h1>
            <div className="fourm-trending-tab">
                <div className="fourm-trending-icon">
                    <img src={trendingImage} alt="" className="fourm-trending-image" />
                </div>

                <div className="fourm-trending-details">
                    <h1 className="fourm-trending-community">{trendingName}</h1>
                    <h2 className="fourm-trending-details">{trendingDetails}</h2>
                </div>
            </div>
        </div>
    </>
  )
}

export default ForumTrendingTab