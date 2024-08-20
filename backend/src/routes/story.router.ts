import express from "express";
import storyController from "../controllers/story.controller";
import ChapterRouter from "./chapter.router";

const router = express.Router();

router.get("/", storyController.getStories);
router.get("/:id", storyController.getStory);
router.post("/", storyController.createStory);
router.put("/:id", storyController.updateStory);
router.delete("/:id", storyController.deleteStory);

router.use("/:storyId/chapters", ChapterRouter);

export default router;
