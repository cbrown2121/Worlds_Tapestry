import { useState } from "react"
import categoryImage from "../../assets/commmunity-default-icon.svg"
import "./CategoryTab.css"

// tags should be an array
function CategoryTab( { title, tags, threadCount, postCount, mostRecent} ) {
  const [count, setCount] = useState(0)

  let tagsText = "";

  for (let i = 0; i < tags.length; i++) {
    tagsText += `#${tags[i]}`;

    (i + 1 < tags.length ? tagsText += ", " : null);
  }

  return (
    <>
        <div className="forum-category-tab">
            <img src={categoryImage} alt="" className="category-image" />

            <table className="category-info">
                <tbody className="category-info-details">
                    <tr>
                        <td className="category-name-text">{title}</td>
                        <td className="category-thread-count">{threadCount}</td>
                        <td className="category-post-count">{postCount}</td>
                        <td className="category-recency-time">{mostRecent}</td>
                    </tr>
                    <tr>
                        <td className="category-tags-text">{tagsText}</td>
                        <td>Threads</td>
                        <td>Posts/Replies</td>
                        <td>Most Recent</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
  )
}

export default CategoryTab