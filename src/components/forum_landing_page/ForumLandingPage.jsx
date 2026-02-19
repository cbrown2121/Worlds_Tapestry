import { useState, useEffect } from "react"
import "./ForumLandingPage.css"
import CategoryTab from "./CategoryTab"
import ForumSection from "./ForumSection"
import ForumTrendingTab from "./ForumTrendingTab"
import defaultIcon from "../../assets/commmunity-default-icon.svg"

function ForumLandingPage() {
    const [count, setCount] = useState(0)

//   default data
    let pinnedOne = { title: "Annoucments", tags: ["tag1", "tag2"], threadCount: "23", postCount: "196", mostRecent: "1 Day Ago"};
    let pinnedTwo = { title: "FAQ", tags: ["tag1", "tag2", "tag3"], threadCount: "1", postCount: "1", mostRecent: "92 Days Ago"};
    let categoryOne = { title: "Category 1", tags: ["tag1", "tag2"], threadCount: "168", postCount: "12,687", mostRecent: "5 Minutes Ago"};
    let categoryTwo = { title: "Category 2", tags: ["tag1", "tag2", "tag3"], threadCount: "12", postCount: "136", mostRecent: "20 Minutes Ago"};
    let categoryThree = { title: "Category 3", tags: ["tag1", "tag2", "tag3"], threadCount: "1,345", postCount: "62,487", mostRecent: "1 Hour Ago"};
  

//   replace keys later
  return (
    <>
        <div className="forum-landing-page landing-page">
            <div className="forum-landing-main landing-page-main">
                <ForumSection title="Pinned Categories" categoryTabsList={[<CategoryTab key={1} {...pinnedOne} />, <CategoryTab key={2} {...pinnedTwo} />]}/>
                <ForumSection title="Categories" categoryTabsList={[<CategoryTab key={1} {...categoryOne} />, <CategoryTab key={2} {...categoryTwo} />, <CategoryTab key={2} {...categoryThree} />]}/>
            </div>
            <div className="forum-landing-side landing-page-side">
                <div className="forum-information-stats landing-page-information-stats">
                    <img src={defaultIcon} alt="" className="forum-image" />
                    <div className="forum-stats landing-page-stats">
                        <h2 className="forum-name landing-page-name">Forum</h2>
                        <h3 className="user-count">13,078</h3>
                        <h3 className="users-online">548</h3>
                        <h3 className="thread-count-stats">8,756</h3>
                        <h3 className="creation-data">xx/xx/xxxx</h3>
                    </div>
                </div>
                <div className="forum-highlights landing-page-highlights">
                    <ForumTrendingTab trendingTitle="Most Popular Category of the Day" trendingName="Category Name" trendingDetails="564 Posts Today" />
                    <ForumTrendingTab trendingTitle="Featured Post" trendingName="Post Title" trendingDetails="Details" />
                    <ForumTrendingTab trendingTitle="Most Post Category of the Day" trendingName="Post Title" trendingDetails="132 Replies" />
                </div>
            </div>
        </div>
    </>
  )
}

export default ForumLandingPage