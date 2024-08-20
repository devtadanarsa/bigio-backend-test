import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import StoryRouter from "./routes/story.router";
import cors from "cors";

export const prisma = new PrismaClient();

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/stories", StoryRouter);

// Catch unregistered route
app.get("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
