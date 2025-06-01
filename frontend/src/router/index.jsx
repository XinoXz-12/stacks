import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import TeamList from "../pages/TeamList";
import TeamDetail from "../pages/TeamDetail";
import UserDetail from "../pages/UserDetail";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Chat from "../pages/Chat";
import MyTeams from "../pages/MyTeams";
import Register from "../pages/Register";
import Faq from "../pages/Faq";
import News from "../pages/News";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                // index: true for default route (/)
                index: true,
                element: <Home />,
            },
            {
                path: "teams",
                element: <TeamList />,
            },
            {
                path: "team/:id",
                element: <TeamDetail />,
            },
            {
                path: "news",
                element: <News />,
            },
            {
                path: "faq",
                element: <Faq />,
            },
            {
                path: "chat",
                element: (
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                ),
            },
            {
                path: "my-teams",
                element: (
                    <ProtectedRoute>
                        <MyTeams />
                    </ProtectedRoute>
                ),
            },
            {
                path: "user/:id",
                element: (
                    <ProtectedRoute>
                        <UserDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
        ],
    },
]);
