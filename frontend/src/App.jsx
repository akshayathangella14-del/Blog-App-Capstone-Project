import { createBrowserRouter, RouterProvider } from "react-router";

import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";

import UserProfile from "./components/UserProfile";
import AuthorProfile from "./components/AuthorProfile";
import AdminProfile from "./components/AdminProfile";

import Articles from "./components/Articles";
import AuthorArticles from "./components/AuthorArticles";

import EditArticle from "./components/EditArticle";
import WriteArticles from "./components/WriteArticles";
import ArticleByID from "./components/ArticleByID";

import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "react-hot-toast";

function App() {

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,

      children: [

        // HOME
        {
          index: true,
          element: <Home />,
        },

        // REGISTER
        {
          path: "register",
          element: <Register />,
        },

        // LOGIN
        {
          path: "login",
          element: <Login />,
        },

        // ALL ARTICLES
        {
          path: "articles",
          element: <Articles />,
        },

        // SINGLE ARTICLE
        {
          path: "article/:id",
          element: <ArticleByID />,
        },

        // EDIT ARTICLE
        {
          path: "edit-article/:id",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <EditArticle />
            </ProtectedRoute>
          ),
        },

        // USER PROFILE
        {
          path: "user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          ),
        },

        // AUTHOR PROFILE
        {
          path: "author-profile",

          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorProfile />
            </ProtectedRoute>
          ),

          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },

            {
              path: "articles",
              element: <AuthorArticles />,
            },

            {
              path: "write-article",
              element: <WriteArticles />,
            },
          ],
        },

        // ADMIN PROFILE
        {
          path: "admin-profile",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProfile />
            </ProtectedRoute>
          ),
        },

        // UNAUTHORIZED
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
  ]);

  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;