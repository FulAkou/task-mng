import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { AuthService } from "../services/auth.service";
import { ResponseService } from "../utils/response";

export class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const result = await AuthService.register(name, email, password);

    return ResponseService.success(
      res,
      result,
      "Utilisateur inscrit avec succès",
      201
    );
  });

  /**
   * Connexion d'un utilisateur
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    return ResponseService.success(res, result, "Connexion réussie");
  });

  /**
   * Rafraîchir le token d'accès
   */
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const result = await AuthService.refreshToken(refreshToken);

    return ResponseService.success(res, result, "Token rafraîchi avec succès");
  });

  /**
   * Déconnexion
   */
  static logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (userId) {
      await AuthService.logout(userId);
    }

    return ResponseService.success(res, null, "Déconnexion réussie");
  });

  /**
   * Obtenir le profil utilisateur
   */
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return ResponseService.unauthorized(res, "Utilisateur non authentifié");
    }

    const profile = await AuthService.getProfile(userId);

    return ResponseService.success(res, profile, "Profil récupéré avec succès");
  });
}
