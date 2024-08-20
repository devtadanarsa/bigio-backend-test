import { Request, Response } from "express";
import { prisma } from "..";
import { handleError } from "../utils/errors";
import { chapterSchema } from "../schema/chapter.schema";

const getChapters = async (req: Request, res: Response) => {
  const { storyId } = req.params;
  try {
    const chapters = await prisma.chapter.findMany({
      where: {
        storyId: parseInt(storyId),
      },
    });
    res.status(200).json({ chapters });
  } catch (error) {
    handleError(error, res);
  }
};

const getChapter = async (req: Request, res: Response) => {
  const { chapterId } = req.params;
  try {
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: parseInt(chapterId),
      },
    });
    res.status(200).json({ chapter });
  } catch (error) {
    handleError(error, res);
  }
};

const createChapter = async (req: Request, res: Response) => {
  const { storyId } = req.params;

  const validatedContent = chapterSchema.parse(req.body);

  try {
    const chapter = await prisma.chapter.create({
      data: {
        title: validatedContent.title,
        content: validatedContent.content,
        storyId: parseInt(storyId),
      },
    });
    res.status(201).json({ chapter });
  } catch (error) {
    handleError(error, res);
  }
};

const updateChapter = async (req: Request, res: Response) => {
  const { chapterId } = req.params;
  const validatedContent = chapterSchema.parse(req.body);

  try {
    const chapter = await prisma.chapter.update({
      where: {
        id: parseInt(chapterId),
      },
      data: {
        title: validatedContent.title,
        content: validatedContent.content,
      },
    });
    res.status(200).json({ chapter });
  } catch (error) {
    handleError(error, res);
  }
};

const deleteChapter = async (req: Request, res: Response) => {
  const { chapterId } = req.params;

  try {
    await prisma.chapter.delete({
      where: {
        id: parseInt(chapterId),
      },
    });
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};

export default {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
};
