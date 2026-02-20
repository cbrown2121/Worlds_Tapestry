import Header from "../Header.jsx"
import ForumLandingPage from "../forum_landing_page/ForumLandingPage.jsx"
import Footer from "../Footer.jsx"
import { useLocation } from 'react-router-dom';


function ForumPage() {

    const location = useLocation();
    const { forumID } = location.state;

    return (
        <>
            <Header />
            <ForumLandingPage forumID={ forumID } /> 
            <Footer />
        </>
    )
}

export default ForumPage        