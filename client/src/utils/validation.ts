import { z } from "zod";

// Schéma pour l'inscription
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères")
      .trim(),
    email: z.string().email("Format d'email invalide").toLowerCase().trim(),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .max(100, "Le mot de passe ne peut pas dépasser 100 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Schéma pour la connexion
export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide").toLowerCase().trim(),
  password: z.string().min(1, "Le mot de passe est requis"),
});

// Schéma pour créer une tâche
export const createTaskSchema = z.object({
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
    .refine((date) => {
      // Accepter les chaînes vides comme valides (pas de date)
      if (!date || date.trim() === "") return true;
      // Valider le format de date si une date est fournie
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) return false;
      // Vérifier que la date est dans le futur
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "La date d'échéance doit être dans le futur")
    .optional()
    .transform((date) => {
      // Transformer les chaînes vides en undefined
      if (!date || date.trim() === "") return undefined;
      return date;
    }),
});

// Schéma pour mettre à jour une tâche
export const updateTaskSchema = z.object({
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
    .refine((date) => {
      // Accepter les chaînes vides comme valides (pas de date)
      if (!date || date.trim() === "") return true;
      // Valider le format de date si une date est fournie
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) return false;
      // Vérifier que la date est dans le futur
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "La date d'échéance doit être dans le futur")
    .optional()
    .transform((date) => {
      // Transformer les chaînes vides en undefined
      if (!date || date.trim() === "") return undefined;
      return date;
    }),
});

// Types TypeScript dérivés des schémas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
