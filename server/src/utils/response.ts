import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | string[];
  timestamp: string;
}

export class ResponseService {
  /**
   * Réponse de succès
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = "Opération réussie",
    statusCode: number = 200,
  ): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Réponse d'erreur
   */
  static error(
    res: Response,
    message: string = "Une erreur est survenue",
    statusCode: number = 500,
    error?: string,
  ): Response<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Réponse de validation d'erreur
   */
  static validationError(
    res: Response,
    message: string = "Données de validation invalides",
    errors?: string | string[],
  ): Response<ApiResponse> {
    return this.error(res, message, 400, errors);
  }

  /**
   * Réponse d'erreur d'authentification
   */
  static unauthorized(res: Response, message: string = "Non autorisé"): Response<ApiResponse> {
    return this.error(res, message, 401);
  }

  /**
   * Réponse d'erreur d'accès interdit
   */
  static forbidden(res: Response, message: string = "Accès interdit"): Response<ApiResponse> {
    return this.error(res, message, 403);
  }

  /**
   * Réponse d'erreur de ressource non trouvée
   */
  static notFound(res: Response, message: string = "Ressource non trouvée"): Response<ApiResponse> {
    return this.error(res, message, 404);
  }

  /**
   * Réponse d'erreur de conflit
   */
  static conflict(res: Response, message: string = "Conflit de données"): Response<ApiResponse> {
    return this.error(res, message, 409);
  }
}
