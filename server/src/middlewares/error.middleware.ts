import { NextFunction, Request, Response } from "express";
import { ResponseService } from "../utils/response";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Une erreur interne est survenue";

  // Gestion des erreurs Mongoose
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Données de validation invalides";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Format d'ID invalide";
  } else if (
    typeof (error as any).code === "number" &&
    (error as any).code === 11000
  ) {
    statusCode = 409;
    message = "Cette ressource existe déjà";
  }

  // Gestion des erreurs JWT
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token invalide";
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expiré";
  }

  // Log de l'erreur (en production, utiliser un logger)
  console.error("Erreur:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Réponse d'erreur
  ResponseService.error(res, message, statusCode, error.stack);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  ResponseService.notFound(res, `Route ${req.originalUrl} non trouvée`);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
