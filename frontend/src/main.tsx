import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.tsx";
import StoryListPage from "./pages/stories/StoryListPage.tsx";
import AddStoryPage from "./pages/stories/AddStoryPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/stories",
    element: <StoryListPage />,
  },
  {
    path: "/stories/add",
    element: <AddStoryPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
