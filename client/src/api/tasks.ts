import axios from "axios";
import type {
  ApiResponse,
  CreateTaskData,
  Task,
  TaskFilters,
  TaskStats,
  UpdateTaskData,
} from "../types";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  `${window.location.origin}/api/v1`;

// Configuration axios avec intercepteur pour ajouter le token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tasksAPI = {
  /**
   * Créer une nouvelle tâche
   */
  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>("/tasks", data);
    return response.data.data!;
  },

  /**
   * Obtenir toutes les tâches de l'utilisateur
   */
  async getUserTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get<ApiResponse<Task[]>>(
      `/tasks?${params.toString()}`
    );
    return response.data.data!;
  },

  /**
   * Obtenir une tâche par ID
   */
  async getTaskById(taskId: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return response.data.data!;
  },

  /**
   * Mettre à jour une tâche
   */
  async updateTask(taskId: string, data: UpdateTaskData): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${taskId}`, data);
    return response.data.data!;
  },

  /**
   * Supprimer une tâche
   */
  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },

  /**
   * Changer le statut d'une tâche
   */
  async updateTaskStatus(
    taskId: string,
    status: Task["status"]
  ): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(
      `/tasks/${taskId}/status`,
      { status }
    );
    return response.data.data!;
  },

  /**
   * Obtenir les statistiques des tâches
   */
  async getTaskStats(): Promise<TaskStats> {
    const response = await api.get<ApiResponse<TaskStats>>("/tasks/stats");
    return response.data.data!;
  },
};

export default tasksAPI;
