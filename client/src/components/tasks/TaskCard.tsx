import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Task } from "../../types";

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onEdit: (task: Task) => void;
  isDeleting: boolean;
  isUpdatingStatus: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onStatusChange,
  onEdit,
  isDeleting,
  isUpdatingStatus,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadgeClass = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "badge-pending";
      case "in-progress":
        return "badge-in-progress";
      case "completed":
        return "badge-completed";
      default:
        return "badge-pending";
    }
  };

  const getPriorityBadgeClass = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "badge-low";
      case "medium":
        return "badge-medium";
      case "high":
        return "badge-high";
      default:
        return "badge-medium";
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "in-progress":
        return "En cours";
      case "completed":
        return "Terminée";
      default:
        return "En attente";
    }
  };

  const getPriorityText = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "Faible";
      case "medium":
        return "Moyenne";
      case "high":
        return "Élevée";
      default:
        return "Moyenne";
    }
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {task.title}
          </h3>

          {/* Badges de statut et priorité */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
              {getStatusText(task.status)}
            </span>
            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
              {getPriorityText(task.priority)}
            </span>
          </div>
        </div>

        {/* Menu d'actions */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                {/* Changer le statut */}
                {task.status !== "pending" && (
                  <button
                    onClick={() => {
                      onStatusChange(task._id, "pending");
                      setShowMenu(false);
                    }}
                    disabled={isUpdatingStatus}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Marquer comme en attente
                  </button>
                )}

                {task.status !== "in-progress" && (
                  <button
                    onClick={() => {
                      onStatusChange(task._id, "in-progress");
                      setShowMenu(false);
                    }}
                    disabled={isUpdatingStatus}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Marquer comme en cours
                  </button>
                )}

                {task.status !== "completed" && (
                  <button
                    onClick={() => {
                      onStatusChange(task._id, "completed");
                      setShowMenu(false);
                    }}
                    disabled={isUpdatingStatus}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Marquer comme terminée
                  </button>
                )}

                {/* Modifier */}
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    className="h-4 w-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modifier
                </button>

                <div className="border-t border-gray-200 my-1"></div>

                {/* Supprimer */}
                <button
                  onClick={() => {
                    onDelete(task._id);
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-4 text-sm text-danger-600 hover:bg-danger-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 inline mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Informations de date */}
      <div className="space-y-2">
        {task.dueDate && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span className={isOverdue ? "text-danger-600 font-medium" : ""}>
              Échéance : {format(new Date(task.dueDate), "PPP", { locale: fr })}
              {isOverdue && " (En retard)"}
            </span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            Créée le {format(new Date(task.createdAt), "PPP", { locale: fr })}
          </span>
        </div>
      </div>

      {/* Indicateur de retard */}
      {isOverdue && (
        <div className="mt-3 p-2 bg-danger-50 border border-danger-200 rounded-md">
          <div className="flex items-center text-danger-700 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            Cette tâche est en retard !
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
