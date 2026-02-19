import { useState } from "react"
import "../ForumLandingPage.css"
import CategoryTab from "../CategoryTab"
import ForumSection from "../ForumSection"
import ForumTrendingTab from "../ForumTrendingTab"
import defaultIcon from "../../../assets/commmunity-default-icon.svg"

function CategoryLandingPage() {
    const [count, setCount] = useState(0)

//   default data
    let pinnedOne = { title: "Annoucments", tags: ["tag1", "tag2"], threadCount: "23", postCount: "196", mostRecent: "1 Day Ago"};
    let pinnedTwo = { title: "FAQ", tags: ["tag1", "tag2", "tag3"], threadCount: "1", postCount: "1", mostRecent: "92 Days Ago"};
    let categoryOne = { title: "Thread 1", tags: ["tag1", "tag2"], postCount: "12,687", mostRecent: "5 Minutes Ago"};
    let categoryTwo = { title: "Thread 2", tags: ["tag1", "tag2", "tag3"], postCount: "136", mostRecent: "20 Minutes Ago"};
    let categoryThree = { title: "Thread 3", tags: ["tag1", "tag2", "tag3"], postCount: "62,487", mostRecent: "1 Hour Ago"};

    const createThread = () => {
        // create later
    }

//   replace keys later
  return (
    <>
        <div className="category-landing-page landing-page">
            <div className="category-landing-main landing-page-main">
                {/* <ForumSection title="Pinned Threads" categoryTabsList={[<CategoryTab key={1} {...pinnedOne} />, <CategoryTab key={2} {...pinnedTwo} />]}/> */}
                <ForumSection title="Threads" categoryTabsList={[<CategoryTab key={1} {...categoryOne} />, <CategoryTab key={2} {...categoryTwo} />, <CategoryTab key={2} {...categoryThree} />]}/>
            </div>
            <div className="category-landing-side landing-page-side">
                <div className="category-information-stats landing-page-information-stats">
                    <img src={defaultIcon} alt="" className="forum-image" />
                    <div className="category-stats landing-page-stats">
                        <h2 className="category-name">Category Name</h2>
                        <p>This text states the rules and purpose of the category</p>
                    </div>
                </div>
                <button onClick={ createThread } className="create-thread">Create a Thread</button>
            </div>
        </div>
    </>
  )
}

export default CategoryLandingPage