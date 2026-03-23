import LandingPage from "./components/landing_page/LandingPage.jsx";
import ForumPage from "./components/forum_landing_page/ForumPage.jsx"
import ForumAdminPage from "./components/forum_landing_page/forum_admin_page/ForumAdminPage.jsx"
import CategoryLandingPage from "./components/forum_landing_page/category_landing_page/CategoryLandingPage.jsx";
import ThreadContent from "./components/forum_landing_page/category_landing_page/thread_page/ThreadContent.jsx";
import ProfilePage from "./components/profile_components/profile_page/ProfilePage.jsx";
import Layout from "./Layout.jsx";
import ForumMapPage from "./components/forum_landing_page/forum_map_page/ForumMapPage.jsx";
import FAQPage from "./components/footer_links/FAQPage.jsx";
import AboutUsPage from "./components/footer_links/AboutPage.jsx";
import GuidelinesPage from "./components/footer_links/GuidelinesPage.jsx";
import ReportPage from "./components/footer_links/ReportPage.jsx";
import SearchPage from "./components/search_page/SearchPage.jsx";

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { UserProvider } from "./contexts/Context.jsx";
import LoginPage from "./components/login_page/LoginPage.jsx";

const App = () => {

  return (
    // we use app as our navigation store (im using we in the royal sense. im just trying to pass on what ive learned about react routing- we can change this up of course)
    // if the url matchs the patch- then we use the component the element is set equal to
    // for the root (/) we go to the landing page. if the url is /Forum/name-of-the-forum- then we view the forum page
    // it would be wonderful to pass the forum id to the component here- but thats hard when that data is many directorys away
    // we handle passing on states when we are making the links (and the links show up where you would expect- the actual components themselves)
    // i set the logo image and website name to go to the homepage always- take a look at it to see a simple link

    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />}/>
              </Route>

              <Route path="/Forum/:forumName" element={<Layout key={window.location.pathname} /> }>
                <Route index element={<ForumPage />}/>
              </Route>

              <Route path="/Profile" element={<Layout />}>
                <Route index element={<ProfilePage />}/>
              </Route>

              <Route path="/Forum/:forumName/category/:categoryName" element={<Layout />}>
                <Route index element={<CategoryLandingPage />}/>
              </Route>
              
              <Route path="/Forum/:forumName/category/:categoryName/thread/:threadName" element={<Layout />}>
                <Route index element={<ThreadContent />}/>
              </Route>

              <Route path="/Forum/:forumName/Admin-Dashboard" element={<Layout />}>
                <Route index element={<ForumAdminPage />}/>
              </Route>

              <Route path="/Forum/:forumName/Map" element={<Layout />}>
                <Route index element={<ForumMapPage />}/>
              </Route>

              <Route path="/FAQ" element={<Layout />}>
                <Route index element={<FAQPage />}/>
              </Route>

              <Route path="/AboutUs" element={<Layout />}>
                <Route index element={<AboutUsPage />}/>
              </Route>

              <Route path="/Guidelines" element={<Layout />}>
                <Route index element={<GuidelinesPage />}/>
              </Route>

              <Route path="/Report" element={<Layout />}>
                <Route index element={<ReportPage />}/>
              </Route>

              <Route path="/Search/:query" element={<Layout />}>
                <Route index element={<SearchPage />}/>
              </Route>

              <Route path="/Login" element={<Layout />}>
                <Route index element={<LoginPage />}/>
              </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App