import { useContext } from "react";
import ForumLandingPage from "../forum_landing_page/ForumLandingPage.jsx"
import { useLocation } from 'react-router-dom';
import { ForumContext } from "../../contexts/Context.jsx";


function ForumPage() {
    const location = useLocation();
    const { forum, setForum } = useContext(ForumContext);

    return (
        <>
            <ForumLandingPage key={location.pathname} forumID={ location.state.forumID } forumTags={ location.state.forumTags } forumName={ location.state.forumName } forumMap ={ location.state.forumMap } /> { /* giving a unique key to the component will force it to rerender. without it the forum links wont work correctly */ }
        </>
    )
}

export default ForumPage        