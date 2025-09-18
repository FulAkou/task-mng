import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { TaskService } from "../services/task.service";
import { ResponseService } from "../utils/response";

export class TaskController {
  /**
   * Créer une nouvelle tâche
   */
  static createTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return ResponseService.unauthorized(res, "Utilisateur non authentifié");
    }

    const task = await TaskService.createTask(req.body, userId);

    return ResponseService.success(res, task, "Tâche créée avec succès", 201);
  });

  /**
   * Obtenir toutes les tâches de l'utilisateur
   */
  static getUserTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return ResponseService.unauthorized(res, "Utilisateur non authentifié");
    }

    const { status, priority, search } = req.query;
    const filters = {
      status: status as string,
      priority: priority as string,
      search: search as string,
    };

    const tasks = await TaskService.getUserTasks(userId, filters);

    return ResponseService.success(res, tasks, "Tâches récupérées avec succès");
  });

  /**
   * Obtenir une tâche par ID
   */
  static getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const taskId = req.params.id;

    if (!userId) {
      return ResponseService.unauthorized(res, "Utilisateur non authentifié");
    }

    const task = await TaskService.getTaskById(taskId, userId);

    return ResponseService.success(res, task, "Tâche récupérée avec succès");
  });

  /**
   * Mettre à jour une tâche
   */
  static updateTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const taskId = req.params.id;

    if (!userId) {
      return ResponseService.unauthorized(res, "Utilisateur non authentifié");
    }

    const updatedTask = await TaskService.updateTask(taskId, req.body, userId);

    return ResponseService.success(
      res,
      updatedTask,
      "Tâche mise à jour avec succès"
    );
  });

  /**
   * Supprimer une tâche
   */
  static deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const taskId = req.params.id;

    if (!userId) {
      return ResponseService.unauthorized(res, "Utilisateur non authentifié");
    }

    await TaskService.deleteTask(taskId, userId);

    return ResponseService.success(res, null, "Tâche supprimée avec succès");
  });

  /**
   * Changer le statut d'une tâche
   */
  static updateTaskStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.userId;
      const taskId = req.params.id;
      const { status } = req.body;

      if (!userId) {
        return ResponseService.unauthorized(res, "Utilisateur non authentifié");
      }

      if (!["pending", "in-progress", "completed"].includes(status)) {
        return ResponseService.validationError(
          res,
          "Statut invalide. Doit être pending, in-progress ou completed"
        );
      }

      const updatedTask = await TaskService.updateTaskStatus(
        taskId,
        status,
        userId
      );

      return ResponseService.success(
        res,
        updatedTask,
        "Statut de la tâche mis à jour avec succès"
      );
    }
  );

  /**
   * Obtenir les statistiques des tâches
   */
  static getTaskStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return ResponseService.unauthorized(res, "Utilisateur non authentifié");
    }

    const stats = await TaskService.getTaskStats(userId);

    return ResponseService.success(
      res,
      stats,
      "Statistiques récupérées avec succès"
    );
  });
}
