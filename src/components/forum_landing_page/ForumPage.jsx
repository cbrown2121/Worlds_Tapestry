import Header from "../Header.jsx"
import ForumLandingPage from "../forum_landing_page/ForumLandingPage.jsx"
import Footer from "../Footer.jsx"
import { useLocation } from 'react-router-dom';


function ForumPage() {
    const location = useLocation();

    return (
        <>
            <Header />
            <ForumLandingPage forumID={ location.state.forumID } /> 
            <Footer />
        </>
    )
}

export default ForumPage        