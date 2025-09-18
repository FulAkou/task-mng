import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import tasksAPI from "../api/tasks";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import type {
  CreateTaskData,
  Task,
  TaskFilters,
  UpdateTaskData,
} from "../types";

const Dashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Récupérer les tâches
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery(["tasks", filters], () => tasksAPI.getUserTasks(filters), {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Récupérer les statistiques
  const { data: stats } = useQuery(
    ["taskStats"],
    () => tasksAPI.getTaskStats(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Mutation pour créer une tâche
  const createTaskMutation = useMutation(
    (data: CreateTaskData) => tasksAPI.createTask(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["taskStats"]);
        setIsCreateModalOpen(false);
        toast.success("Tâche créée avec succès !");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message ||
          "Erreur lors de la création de la tâche";
        toast.error(message);
      },
    }
  );

  // Mutation pour supprimer une tâche
  const deleteTaskMutation = useMutation(
    (taskId: string) => tasksAPI.deleteTask(taskId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["taskStats"]);
        toast.success("Tâche supprimée avec succès !");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message ||
          "Erreur lors de la suppression de la tâche";
        toast.error(message);
      },
    }
  );

  // Mutation pour changer le statut d'une tâche
  const updateStatusMutation = useMutation(
    ({ taskId, status }: { taskId: string; status: Task["status"] }) =>
      tasksAPI.updateTaskStatus(taskId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["taskStats"]);
        toast.success("Statut mis à jour avec succès !");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message ||
          "Erreur lors de la mise à jour du statut";
        toast.error(message);
      },
    }
  );

  // Mutation pour mettre à jour une tâche
  const updateTaskMutation = useMutation(
    ({ taskId, data }: { taskId: string; data: UpdateTaskData }) =>
      tasksAPI.updateTask(taskId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["taskStats"]);
        setIsEditModalOpen(false);
        setEditingTask(null);
        toast.success("Tâche mise à jour avec succès !");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message ||
          "Erreur lors de la mise à jour de la tâche";
        toast.error(message);
      },
    }
  );

  // Gérer la création d'une tâche
  const handleCreateTask = (data: CreateTaskData) => {
    createTaskMutation.mutate(data);
  };

  // Gérer l'ouverture du modal d'édition
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  // Gérer la mise à jour d'une tâche
  const handleUpdateTask = (data: UpdateTaskData) => {
    if (editingTask) {
      updateTaskMutation.mutate({ taskId: editingTask._id, data });
    }
  };

  // Gérer la fermeture du modal d'édition
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Gérer la suppression d'une tâche
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  // Gérer le changement de statut
  const handleStatusChange = (taskId: string, status: Task["status"]) => {
    updateStatusMutation.mutate({ taskId, status });
  };

  // Appliquer les filtres
  const applyFilters = () => {
    setFilters({
      ...filters,
      search: searchTerm,
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  // Filtrer les tâches par statut
  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-danger-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Erreur lors du chargement des tâches
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Veuillez réessayer plus tard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Gérez vos tâches et suivez votre progression
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inProgress}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-danger-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overdue}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barre d'outils */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des tâches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value || undefined })
              }
              className="input max-w-xs"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Terminées</option>
            </select>

            <select
              value={filters.priority || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priority: e.target.value || undefined,
                })
              }
              className="input max-w-xs"
            >
              <option value="">Toutes les priorités</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>

            <button onClick={applyFilters} className="btn btn-primary">
              <Filter className="h-4 w-4 mr-2" />
              Appliquer
            </button>

            <button onClick={resetFilters} className="btn btn-secondary">
              Réinitialiser
            </button>
          </div>

          {/* Bouton créer une tâche */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </button>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des tâches...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune tâche trouvée
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.status || filters.priority || searchTerm
                ? "Essayez de modifier vos filtres"
                : "Commencez par créer votre première tâche"}
            </p>
            {!filters.status && !filters.priority && !searchTerm && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer une tâche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                isDeleting={deleteTaskMutation.isLoading}
                isUpdatingStatus={updateStatusMutation.isLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de création de tâche */}
      {isCreateModalOpen && (
        <TaskForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => handleCreateTask(data as CreateTaskData)}
          isLoading={createTaskMutation.isLoading}
        />
      )}

      {/* Modal d'édition de tâche */}
      {isEditModalOpen && editingTask && (
        <TaskForm
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateTask}
          isLoading={updateTaskMutation.isLoading}
          isEditing={true}
          initialData={{
            title: editingTask.title,
            description: editingTask.description || "",
            status: editingTask.status,
            priority: editingTask.priority,
            dueDate: editingTask.dueDate
              ? new Date(editingTask.dueDate).toISOString().slice(0, 16)
              : "",
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
