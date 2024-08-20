import { Request, Response } from "express";
import { prisma } from "..";
import { handleError } from "../utils/errors";
import { chapterSchema } from "../schema/chapter.schema";

/**
 * @route GET /stories/:storyId/chapters
 * @desc Get all chapters for a specific story
 * @param {string} storyId - The ID of the story to get chapters for
 * @returns {object} 200 - An object containing the list of chapters
 * @returns {object} 500 - An error object if something goes wrong
 */
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

/**
 * @route GET /stories/:storyId/chapters/:chapterId
 * @desc Get a specific chapter
 * @param {string} chapterId - The ID of the chapter to get
 * @returns {object} 200 - An object containing the chapter
 * @returns {object} 500 - An error object if something goes wrong
 */
const getChapter = async (req: Request, res: Response) => {
  const { chapterId } = req.params;
  try {
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: parseInt(chapterId),
      },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.status(200).json({ chapter });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * @route POST /stories/:storyId/chapters
 * @desc Create a new chapter
 * @param {string} storyId - The ID of the story to create the chapter for
 * @param {string} title - The title of the chapter
 * @param {string} content - The content of the chapter
 * @returns {object} 201 - An object containing the created chapter
 * @returns {object} 500 - An error object if something goes wrong
 */
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

/**
 * @route PUT /stories/:storyId/chapters/:chapterId
 * @desc Update a specific chapter
 * @param {string} chapterId - The ID of the chapter to update
 * @param {string} title - The title of the chapter
 * @param {string} content - The content of the chapter
 * @returns {object} 200 - An object containing the updated chapter
 * @returns {object} 500 - An error object if something goes wrong
 */
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

/**
 * @route DELETE /stories/:storyId/chapters/:chapterId
 * @desc Delete a specific chapter
 * @param {string} chapterId - The ID of the chapter to delete
 * @returns {object} 204 - An empty response
 * @returns {object} 500 - An error object if something goes wrong
 */
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
