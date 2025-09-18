import { z } from "zod";

// Schéma pour l'inscription
export const registerSchema = z.object({
  body: z.object({
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
  }),
});

// Schéma pour la connexion
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Format d'email invalide").toLowerCase().trim(),
    password: z.string().min(1, "Le mot de passe est requis"),
  }),
});

// Schéma pour le refresh token
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Le refresh token est requis"),
  }),
});

// Types TypeScript dérivés des schémas
export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];
