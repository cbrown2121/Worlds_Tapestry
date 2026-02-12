import { useState } from "react"
import searchIcon from "../assets/search.svg"

function SearchBar() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div id="search-bar">
            <p id="search-bar-text">Search...</p>
            <img src={searchIcon} alt="" id="search-bar-icon" />
        </div>
    </>
  )
}

export default SearchBar