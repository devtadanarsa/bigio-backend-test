import { z } from "zod";
import { Response } from "express";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ errors: error.errors });
  } else if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
};
