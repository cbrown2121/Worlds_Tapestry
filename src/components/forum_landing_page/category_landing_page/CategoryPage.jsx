import Header from "../../Header.jsx"
import CategoryLandingPage from "./CategoryLandingPage.jsx"
import Footer from "../../Footer.jsx"
import { useLocation } from 'react-router-dom';


function CategoryPage() {
    const state = useLocation().state;

    return (
        <>
            <Header />
            <CategoryLandingPage forumID={state.forumID} categoryID={state.categoryID}/> 
            <Footer />
        </>
    )
}

export default CategoryPage        