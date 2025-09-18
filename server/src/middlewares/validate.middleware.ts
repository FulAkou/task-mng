import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ResponseService } from "../utils/response";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return ResponseService.validationError(
          res,
          "Données de validation invalides",
          errorMessages
        );
      }

      return ResponseService.error(
        res,
        "Erreur de validation",
        400,
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    }
  };
};
