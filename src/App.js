import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewApproved from "./scenes/approved/View.jsx";
import Approved from "./scenes/approved/index.jsx";
import Changepw from "./scenes/auth/changepw/index.jsx";
import Signup from "./scenes/auth/signup/Signup.jsx";
import AddBlog from "./scenes/blogs/AddBlogs.jsx";
import EditBlog from "./scenes/blogs/EditBlogs.jsx";
import ViewPending from "./scenes/blogs/View.jsx";
import AddMovie from "./scenes/movies/AddMovies.jsx";
import EditMovie from "./scenes/movies/EditMovies.jsx";
import ViewMovie from "./scenes/movies/View.jsx";
import Movie from "./scenes/movies/index.jsx";

import Pending from "./scenes/blogs/index.jsx";
import Dashboard from "./scenes/dashboard";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import PrivateRoutes from "./scenes/utils/PrivateRoutes.jsx";
import { ColorModeContext, useMode } from "./theme";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/dd" element={<Dashboard />} />

                <Route path="/blog" element={<Pending />} />
                <Route path="/blog/add" element={<AddBlog />} />
                <Route path="/blog/view/:id" element={<ViewPending />} />
                <Route path="/blog/edit/:id" element={<EditBlog />} />

                <Route path="/movie" element={<Movie />} />
                <Route path="/movie/add" element={<AddMovie />} />
                <Route path="/movie/view/:id" element={<ViewMovie />} />
                <Route path="/movie/edit/:id" element={<EditMovie />} />

                <Route path="/approved" element={<Approved />} />

                <Route
                  path="/casting/approved/view/:id"
                  element={<ViewApproved />}
                />

                <Route path="/changepw" element={<Changepw />} />
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
