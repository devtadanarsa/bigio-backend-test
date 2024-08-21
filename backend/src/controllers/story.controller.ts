import { Request, Response } from "express";
import { prisma } from "..";
import { storySchema } from "../schema/story.schema";
import { handleError } from "../utils/errors";

/**
 * Get all stories.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A list of all stories in JSON format
 */
const getStories = async (req: Request, res: Response) => {
  const { category, status, title, author } = req.query;

  try {
    const stories = await prisma.story.findMany({
      where: {
        ...(category && { category: category as string }),
        ...(status && { status: status as string }),
        ...(title && {
          title: { contains: title as string, mode: "insensitive" },
        }),
        ...(author && {
          author: { contains: author as string, mode: "insensitive" },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({ stories: stories });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Get a single story by ID.
 *
 * @param req - Express request object with story ID in params
 * @param res - Express response object
 * @returns The story with the given ID in JSON format or a 404 error if not found
 */
const getStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!story) {
      res.status(404).json({ error: "Story not found" });
    } else {
      res.status(200).json({ story });
    }
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Create a new story.
 *
 * @param req - Express request object with story data in body
 * @param res - Express response object
 * @returns The created story in JSON format or a 400 error if invalid data
 */
const createStory = async (req: Request, res: Response) => {
  try {
    const validatedStory = storySchema.parse(req.body);

    const newStory = await prisma.story.create({
      data: validatedStory,
    });

    res.status(201).json({ story: newStory });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Update a story by ID.
 *
 * @param req - Express request object with story ID in params and new data in body
 * @param res - Express response object
 * @returns The updated story in JSON format or a 400 error if invalid data
 */
const updateStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedStory = storySchema.parse(req.body);

    const updatedStory = await prisma.story.update({
      where: {
        id: parseInt(id),
      },
      data: validatedStory,
    });

    res.status(200).json({ story: updatedStory });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Delete a story by ID.
 *
 * @param req - Express request object with story ID in params
 * @param res - Express response object
 * @returns A 204 status code if successful or a 404 error if not found
 */
const deleteStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.chapter.deleteMany({
      where: {
        storyId: parseInt(id),
      },
    });

    await prisma.story.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(204).end();
  } catch (error) {
    handleError(error, res);
  }
};

export default {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
};
