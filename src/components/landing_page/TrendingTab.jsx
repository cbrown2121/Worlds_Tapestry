import { useState } from "react"
import trendingImage from "../../assets/commmunity-default-icon.svg"
import "./TrendingTab.css"

function TrendingTab( {trendingTitle, trendingCommunity, trendingDetails} ) {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="trending">
            <h1 className="trending-label">{trendingTitle}</h1>
            <div className="trending-tab">
                <div className="trending-icon">
                    <img src={trendingImage} alt="" className="trending-image" />
                </div>

                <div className="trending-details">
                    <h1 className="trending-community">{trendingCommunity}</h1>
                    <h2 className="trending-details">{trendingDetails}</h2>
                </div>
            </div>
        </div>
    </>
  )
}

export default TrendingTab