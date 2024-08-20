import express from "express";
import chapterController from "../controllers/chapter.controller";

const router = express.Router({ mergeParams: true });

router.get("/", chapterController.getChapters);
router.get("/:chapterId", chapterController.getChapter);
router.post("/", chapterController.createChapter);
router.put("/:chapterId", chapterController.updateChapter);
router.delete("/:chapterId", chapterController.deleteChapter);

export default router;
