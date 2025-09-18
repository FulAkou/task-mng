import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createTaskSchema,
  deleteTaskSchema,
  updateTaskSchema,
} from "../schemas/task.schema";

const router = Router();

// Toutes les routes de tâches nécessitent une authentification
router.use(authMiddleware);

// Route pour créer une tâche
router.post("/", validate(createTaskSchema), TaskController.createTask);

// Route pour obtenir toutes les tâches de l'utilisateur
router.get("/", TaskController.getUserTasks);

// Route pour obtenir les statistiques des tâches
router.get("/stats", TaskController.getTaskStats);

// Route pour obtenir une tâche par ID
router.get("/:id", TaskController.getTaskById);

// Route pour mettre à jour une tâche
router.put("/:id", validate(updateTaskSchema), TaskController.updateTask);

// Route pour changer le statut d'une tâche
router.patch("/:id/status", TaskController.updateTaskStatus);

// Route pour supprimer une tâche
router.delete("/:id", validate(deleteTaskSchema), TaskController.deleteTask);

export default router;
