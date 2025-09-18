import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import {
  CreateTaskFormData,
  UpdateTaskFormData,
  createTaskSchema,
  updateTaskSchema,
} from "../../utils/validation";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskFormData | UpdateTaskFormData) => void;
  isLoading: boolean;
  initialData?: CreateTaskFormData | UpdateTaskFormData;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskFormData | UpdateTaskFormData>({
    resolver: zodResolver(isEditing ? updateTaskSchema : createTaskSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (
    data: CreateTaskFormData | UpdateTaskFormData
  ) => {
    // Si c'est une édition, nous devons nous assurer que les champs requis sont présents
    if (isEditing) {
      const updateData: UpdateTaskFormData = {};
      if (data.title) updateData.title = data.title;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.status) updateData.status = data.status;
      if (data.priority) updateData.priority = data.priority;
      if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;

      await onSubmit(updateData);
    } else {
      // Pour la création, les données sont déjà dans le bon format
      await onSubmit(data as CreateTaskFormData);
    }

    if (!isLoading) {
      reset();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Modifier la tâche" : "Nouvelle tâche"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6"
        >
          {/* Titre */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Titre *
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              className="input"
              placeholder="Titre de la tâche"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={3}
              className="input resize-none"
              placeholder="Description de la tâche (optionnel)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Statut et priorité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Statut
              </label>
              <select {...register("status")} id="status" className="input">
                <option value="pending">En attente</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminée</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-danger-600">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Priorité
              </label>
              <select {...register("priority")} id="priority" className="input">
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-danger-600">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Date d'échéance */}
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date d'échéance
            </label>
            <input
              {...register("dueDate")}
              type="datetime-local"
              id="dueDate"
              className="input"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-danger-600">
                {errors.dueDate.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Laissez vide si aucune échéance n'est définie
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn btn-primary"
            >
              {isSubmitting || isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : initialData ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
