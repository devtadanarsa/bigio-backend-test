import request from "supertest";
import express from "express";
import { prisma } from "..";
import StoryRouter from "../routes/story.router";

// Mock the Prisma client
jest.mock("..", () => ({
  prisma: {
    story: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use("/stories", StoryRouter);

describe("Story Controller", () => {
  // Clear all mocks after each test to ensure no test affects others
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /stories", () => {
    it("should return all stories", async () => {
      const mockStories = [{ id: 1, title: "Test Story" }];
      (prisma.story.findMany as jest.Mock).mockResolvedValue(mockStories);

      const res = await request(app).get("/stories");

      expect(res.status).toBe(200);
      expect(res.body.stories).toEqual(mockStories);
      expect(prisma.story.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /stories/:id", () => {
    it("should return a single story by ID", async () => {
      const mockStory = { id: 1, title: "Test Story" };
      (prisma.story.findUnique as jest.Mock).mockResolvedValue(mockStory);

      const res = await request(app).get("/stories/1");

      expect(res.status).toBe(200);
      expect(res.body.story).toEqual(mockStory);
      expect(prisma.story.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return 404 if story not found", async () => {
      (prisma.story.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get("/stories/1");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Story not found");
    });
  });

  describe("POST /stories", () => {
    it("should create a new story", async () => {
      const mockStory = {
        id: 1,
        title: "Test Story",
        author: "John Doe",
        category: "fiction",
        tags: ["tag1", "tag2"],
        status: "DRAFT",
        synopsis: "A test story",
        storyCover: "https://example.com",
      };
      const newStory = {
        title: "Test Story",
        author: "John Doe",
        category: "fiction",
        tags: ["tag1", "tag2"],
        status: "DRAFT",
        synopsis: "A test story",
        storyCover: "https://example.com",
      };
      (prisma.story.create as jest.Mock).mockResolvedValue(mockStory);

      const res = await request(app).post("/stories").send(newStory);

      expect(res.status).toBe(201);
      expect(res.body.story).toEqual(mockStory);
      expect(prisma.story.create).toHaveBeenCalledWith({
        data: newStory,
      });
    });
  });

  describe("PUT /stories/:id", () => {
    it("should update a story by ID", async () => {
      const mockStory = {
        id: 1,
        title: "Test Story",
        author: "John Doe",
        category: "fiction",
        tags: ["tag1", "tag2"],
        status: "DRAFT",
        synopsis: "A test story",
        storyCover: "https://example.com",
      };
      const updatedStory = {
        title: "Updated Story",
        author: "John Lennon",
        category: "drama",
        tags: ["tag1", "tag2", "tag3"],
        status: "PUBLISHED",
        synopsis: "A test story of life",
        storyCover: "https://example.com//updated",
      };
      (prisma.story.update as jest.Mock).mockResolvedValue(mockStory);

      const res = await request(app).put("/stories/1").send(updatedStory);

      expect(res.status).toBe(200);
      expect(res.body.story).toEqual(mockStory);
      expect(prisma.story.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedStory,
      });
    });
  });

  describe("DELETE /stories/:id", () => {
    it("should delete a story by ID", async () => {
      (prisma.story.delete as jest.Mock).mockResolvedValue({});

      const res = await request(app).delete("/stories/1");

      expect(res.status).toBe(204);
      expect(prisma.story.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
