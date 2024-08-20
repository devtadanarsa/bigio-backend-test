import request from "supertest";
import express from "express";
import { prisma } from "..";
import ChapterRouter from "../routes/chapter.router"; // Adjust the import path according to your file structure

// Mock the Prisma client
jest.mock("..", () => ({
  prisma: {
    chapter: {
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
app.use("/stories/:storyId/chapters", ChapterRouter);

describe("Chapter Controller", () => {
  // Clear all mocks after each test to ensure no test affects others
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /stories/:storyId/chapters", () => {
    it("should return all chapters for a specific story", async () => {
      const mockChapters = [
        { id: 1, title: "Test Chapter", content: "Test Content", storyId: 1 },
      ];
      (prisma.chapter.findMany as jest.Mock).mockResolvedValue(mockChapters);

      const res = await request(app).get("/stories/1/chapters");

      expect(res.status).toBe(200);
      expect(res.body.chapters).toEqual(mockChapters);
      expect(prisma.chapter.findMany).toHaveBeenCalledWith({
        where: { storyId: 1 },
      });
    });
  });

  describe("GET /stories/:storyId/chapters/:chapterId", () => {
    it("should return a specific chapter", async () => {
      const mockChapter = {
        id: 1,
        title: "Test Chapter",
        content: "Test Content",
        storyId: 1,
      };
      (prisma.chapter.findUnique as jest.Mock).mockResolvedValue(mockChapter);

      const res = await request(app).get("/stories/1/chapters/1");

      expect(res.status).toBe(200);
      expect(res.body.chapter).toEqual(mockChapter);
      expect(prisma.chapter.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return 404 if chapter not found", async () => {
      (prisma.chapter.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get("/stories/1/chapters/1");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Chapter not found");
    });
  });

  describe("POST /stories/:storyId/chapters", () => {
    it("should create a new chapter", async () => {
      const newChapter = { title: "Test Chapter", content: "Test Content" };
      const mockChapter = { id: 1, ...newChapter, storyId: 1 };
      (prisma.chapter.create as jest.Mock).mockResolvedValue(mockChapter);

      const res = await request(app)
        .post("/stories/1/chapters")
        .send(newChapter);

      expect(res.status).toBe(201);
      expect(res.body.chapter).toEqual(mockChapter);
      expect(prisma.chapter.create).toHaveBeenCalledWith({
        data: { ...newChapter, storyId: 1 },
      });
    });
  });

  describe("PUT /stories/:storyId/chapters/:chapterId", () => {
    it("should update a specific chapter", async () => {
      const updatedChapter = {
        title: "Updated Chapter",
        content: "Updated Content",
      };
      const mockChapter = { id: 1, ...updatedChapter, storyId: 1 };
      (prisma.chapter.update as jest.Mock).mockResolvedValue(mockChapter);

      const res = await request(app)
        .put("/stories/1/chapters/1")
        .send(updatedChapter);

      expect(res.status).toBe(200);
      expect(res.body.chapter).toEqual(mockChapter);
      expect(prisma.chapter.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedChapter,
      });
    });
  });

  describe("DELETE /stories/:storyId/chapters/:chapterId", () => {
    it("should delete a specific chapter", async () => {
      (prisma.chapter.delete as jest.Mock).mockResolvedValue({});

      const res = await request(app).delete("/stories/1/chapters/1");

      expect(res.status).toBe(204);
      expect(prisma.chapter.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
