import { NextFunction, Request, Response } from "express";
import { JWTPayload, JWTService } from "../utils/jwt";
import { ResponseService } from "../utils/response";

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ResponseService.unauthorized(res, "Token d'authentification manquant");
      return;
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    if (!token) {
      ResponseService.unauthorized(res, "Token d'authentification invalide");
      return;
    }

    try {
      const decoded = JWTService.verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (jwtError) {
      ResponseService.unauthorized(
        res,
        "Token d'authentification expiré ou invalide"
      );
      return;
    }
  } catch (error) {
    ResponseService.error(
      res,
      "Erreur d'authentification",
      500,
      error instanceof Error ? error.message : "Erreur inconnue"
    );
    return;
  }
};
