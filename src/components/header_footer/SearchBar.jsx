import { useState } from "react"
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search.svg"
import { universalDatabaseFetch } from "../../utility.js";

function SearchBar() {
  const [count, setCount] = useState(0);
  let navigate = useNavigate();

  const handleSearchInput = async (event) => {
    event.preventDefault();
    const searchBarData = new FormData(event.currentTarget);

    navigate(`/Search/${searchBarData.get("search-bar-input")}`);

    window.location.reload(); // reload window to show data change
  }

  return (
    <>
      <form action="" onSubmit={handleSearchInput} id="search-bar-form">
        <div id="search-bar">
            <input type="text" name="search-bar-input" id="search-bar-input"/>
            <img src={searchIcon} alt="" id="search-bar-icon" />
        </div>
      </form>
    </>
  )
}

export default SearchBar