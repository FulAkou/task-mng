import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, refreshTokenSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);

router.post("/login", validate(loginSchema), AuthController.login);

router.post("/refresh", validate(refreshTokenSchema), AuthController.refreshToken);

// Routes protégées - Nécessitent une authentification
router.use(authMiddleware);

// Route protégée - Déconnexion
router.post("/logout", AuthController.logout);

// Route protégée - Obtenir le profil
router.get("/profile", AuthController.getProfile);

export default router;
