import LandingPage from "./components/landing_page/LandingPage.jsx";
import ForumPage from "./components/forum_landing_page/ForumPage.jsx";
import CategoryPage from "./components/forum_landing_page/category_landing_page/CategoryPage.jsx";
import ThreadPage from "./components/forum_landing_page/category_landing_page/thread_page/ThreadPage.jsx";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    // we use app as our navigation store (im using we in the royal sense. im just trying to pass on what ive learned about react routing- we can change this up of course)
    // if the url matchs the patch- then we use the component the element is set equal to
    // for the root (/) we go to the landing page. if the url is /Forum/name-of-the-forum- then we view the forum page
    // it would be wonderful to pass the forum id to the component here- but thats hard when that data is many directorys away
    // we handle passing on states when we are making the links (and the links show up where you would expect- the actual components themselves)
    // i set the logo image and website name to go to the homepage always- take a look at it to see a simple link
    <>
      
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Forum/:forumName" element={<ForumPage />} /> { /* : is used when the URL is a variable. we might be able to make a set up where each forum has its own URL (and thats kinda what im doing right now)- but then we have to restrict forum names to be one of one. */ }
            <Route path="/Forum/:forumName/category/:categoryName" element={<CategoryPage />} />
            <Route path="/Forum/:forumName/category/:categoryName/thread/:threadName" element={<ThreadPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App