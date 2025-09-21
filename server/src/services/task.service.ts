import mongoose from "mongoose";
import { ITask, Task } from "../models/task.model";
import { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";

export class TaskService {
  /**
   * Créer une nouvelle tâche
   */
  static async createTask(taskData: CreateTaskInput, userId: string): Promise<ITask> {
    const task = new Task({
      ...taskData,
      userId,
    });

    return await task.save();
  }

  /**
   * Obtenir toutes les tâches d'un utilisateur
   */
  static async getUserTasks(
    userId: string,
    filters?: {
      status?: string;
      priority?: string;
      search?: string;
    },
  ): Promise<ITask[]> {
    let query = Task.find({ userId });

    // Appliquer les filtres
    if (filters?.status) {
      query = query.where("status", filters.status);
    }

    if (filters?.priority) {
      query = query.where("priority", filters.priority);
    }

    if (filters?.search) {
      query = query.or([
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ]);
    }

    // Trier par date de création (plus récent en premier)
    query = query.sort({ createdAt: -1 });

    return await query.exec();
  }

  /**
   * Obtenir une tâche par ID
   */
  static async getTaskById(taskId: string, userId: string): Promise<ITask> {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new Error("Tâche non trouvée");
    }
    return task;
  }

  /**
   * Mettre à jour une tâche
   */
  static async updateTask(
    taskId: string,
    updateData: UpdateTaskInput,
    userId: string,
  ): Promise<ITask> {
    const task = await Task.findOneAndUpdate({ _id: taskId, userId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      throw new Error("Tâche non trouvée");
    }

    return task;
  }

  /**
   * Supprimer une tâche
   */
  static async deleteTask(taskId: string, userId: string): Promise<void> {
    const result = await Task.deleteOne({ _id: taskId, userId });

    if (result.deletedCount === 0) {
      throw new Error("Tâche non trouvée");
    }
  }

  /**
   * Changer le statut d'une tâche
   */
  static async updateTaskStatus(
    taskId: string,
    status: "pending" | "in-progress" | "completed",
    userId: string,
  ): Promise<ITask> {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { status },
      { new: true, runValidators: true },
    );

    if (!task) {
      throw new Error("Tâche non trouvée");
    }

    return task;
  }

  /**
   * Obtenir les statistiques des tâches d'un utilisateur
   */
  static async getTaskStats(userId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  }> {
    const stats = await Task.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [{ $ne: ["$status", "completed"] }, { $lt: ["$dueDate", new Date()] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
    };

    return result;
  }
}
