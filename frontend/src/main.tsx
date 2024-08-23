import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.tsx";
import StoryListPage from "./pages/stories/StoryListPage.tsx";
import AddStoryPage from "./pages/stories/AddStoryPage.tsx";
import AddChapterPage from "./pages/chapters/AddChapterPage.tsx";
import EditStoryPage from "./pages/stories/EditStoryPage.tsx";

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
  {
    path: "/stories/:id/edit",
    element: <EditStoryPage />,
  },
  {
    path: "/chapters/add",
    element: <AddChapterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
