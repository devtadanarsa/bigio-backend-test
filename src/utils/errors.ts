import { z } from "zod";
import { Response } from "express";
import { Prisma } from "@prisma/client";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof z.ZodError) {
    // Handle Zod validation errors
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: error.errors.map((e) => e.message),
    });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (error.code) {
      // Record to delete does not exist
      case "P2025":
        res.status(404).json({
          status: "error",
          message: "Record not found",
        });
        break;

      // Unique constraint failed
      case "P2002":
        res.status(409).json({
          status: "error",
          message: "Record already exists",
        });
        break;
      default:
        res.status(400).json({
          status: "error",
          message: "Database error",
        });
    }
  } else if (error instanceof Error) {
    // Handle other errors
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  } else {
    // Handle unknown errors
    res.status(500).json({
      status: "error",
      message: "An unknown error occurred",
    });
  }
};
