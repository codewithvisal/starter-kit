import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { AppError } from "../utils/error";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof Error) {
        return next(new AppError(error.message, 400));
      }
      return next(new AppError("Validation error", 400));
    }
  };
