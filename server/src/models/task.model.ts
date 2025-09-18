import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      minlength: [3, "Le titre doit contenir au moins 3 caractères"],
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: "Le statut doit être pending, in-progress ou completed",
      },
      default: "pending",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "La priorité doit être low, medium ou high",
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (this: ITask, value: Date) {
          return !value || value > new Date();
        },
        message: "La date d'échéance doit être dans le futur",
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur est requis"],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, priority: 1 });

// Méthode pour vérifier si la tâche est en retard
taskSchema.methods.isOverdue = function (): boolean {
  if (!this.dueDate) return false;
  return this.status !== "completed" && this.dueDate < new Date();
};

export const Task = mongoose.model<ITask>("Task", taskSchema);
