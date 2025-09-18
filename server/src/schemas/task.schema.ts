import { z } from "zod";

// Schéma pour créer une tâche
export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Le titre doit contenir au moins 3 caractères")
      .max(100, "Le titre ne peut pas dépasser 100 caractères")
      .trim(),
    description: z
      .string()
      .max(500, "La description ne peut pas dépasser 500 caractères")
      .optional(),
    status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    dueDate: z
      .string()
      .refine((val) => {
        // Accepter les chaînes vides et undefined comme valides
        if (!val || val.trim() === "") return true;
        // Valider le format de date si une valeur est fournie
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Format de date invalide")
      .optional()
      .transform((val) => {
        // Transformer les chaînes vides en undefined
        if (!val || val.trim() === "") return undefined;
        // Convertir en Date si une valeur valide est fournie
        return new Date(val);
      }),
  }),
});

// Schéma pour mettre à jour une tâche
export const updateTaskSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, "L'ID de la tâche est requis")
      .regex(/^[0-9a-fA-F]{24}$/, "Format d'ID MongoDB invalide"),
  }),
  body: z.object({
    title: z
      .string()
      .min(3, "Le titre doit contenir au moins 3 caractères")
      .max(100, "Le titre ne peut pas dépasser 100 caractères")
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, "La description ne peut pas dépasser 500 caractères")
      .optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z
      .string()
      .refine((val) => {
        // Accepter les chaînes vides et undefined comme valides
        if (!val || val.trim() === "") return true;
        // Valider le format de date si une valeur est fournie
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Format de date invalide")
      .optional()
      .transform((val) => {
        // Transformer les chaînes vides en undefined
        if (!val || val.trim() === "") return undefined;
        // Convertir en Date si une valeur valide est fournie
        return new Date(val);
      }),
  }),
});

// Schéma pour supprimer une tâche
export const deleteTaskSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, "L'ID de la tâche est requis")
      .regex(/^[0-9a-fA-F]{24}$/, "Format d'ID MongoDB invalide"),
  }),
});

// Types TypeScript dérivés des schémas
export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];
export type TaskParams = z.infer<typeof updateTaskSchema>["params"];
