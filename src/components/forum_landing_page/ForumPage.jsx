import Header from "../Header.jsx"
import ForumLandingPage from "../forum_landing_page/ForumLandingPage.jsx"
import Footer from "../Footer.jsx"
import { useLocation } from 'react-router-dom';


function ForumPage() {
    const location = useLocation();

    return (
        <>
            <ForumLandingPage key={location.pathname} forumID={ location.state.forumID } forumName={ location.state.forumName } /> { /* giving a unique key to the component will force it to rerender. without it the forum links wont work correctly */ }
        </>
    )
}

export default ForumPage        