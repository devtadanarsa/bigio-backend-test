import { Request, Response } from "express";
import { prisma } from "..";
import { storySchema } from "../schema/story.schema";
import { handleError } from "../utils/errors";

const getStories = async (req: Request, res: Response) => {
  try {
    const stories = await prisma.story.findMany();
    res.status(200).json({ stories: stories });
  } catch (error) {
    handleError(error, res);
  }
};

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
      res.status(200).json({ story: story });
    }
  } catch (error) {
    handleError(error, res);
  }
};

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

const deleteStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
