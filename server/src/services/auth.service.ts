import { IUser, User } from "../models/user.model";
import { JWTService, TokenPair } from "../utils/jwt";

export interface AuthResult {
  user: Omit<IUser, "password" | "refreshToken">;
  tokens: TokenPair;
}

export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(name: string, email: string, password: string): Promise<AuthResult> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Créer le nouvel utilisateur
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Générer les tokens
    const tokens = JWTService.generateTokenPair(user);

    // Sauvegarder le refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Retourner l'utilisateur et les tokens

    const userWithoutSensitiveData = user.toObject() as Omit<IUser, "password" | "refreshToken"> & {
      password?: string;
      refreshToken?: string;
    };
    delete userWithoutSensitiveData.password;
    delete userWithoutSensitiveData.refreshToken;

    return {
      user: userWithoutSensitiveData,
      tokens,
    };
  }

  /**
   * Connexion d'un utilisateur
   */
  static async login(email: string, password: string): Promise<AuthResult> {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Générer les tokens
    const tokens = JWTService.generateTokenPair(user);

    // Sauvegarder le refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Retourner l'utilisateur et les tokens

    const userWithoutSensitiveData = user.toObject() as Omit<IUser, "password" | "refreshToken"> & {
      password?: string;
      refreshToken?: string;
    };
    delete userWithoutSensitiveData.password;
    delete userWithoutSensitiveData.refreshToken;

    return {
      user: userWithoutSensitiveData,
      tokens,
    };
  }

  /**
   * Rafraîchir le token d'accès
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Vérifier le refresh token
    const payload = JWTService.verifyRefreshToken(refreshToken);

    // Trouver l'utilisateur
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Refresh token invalide");
    }

    // Générer un nouveau token d'accès
    const accessToken = JWTService.refreshAccessToken(refreshToken);

    return { accessToken };
  }

  /**
   * Déconnexion (invalider le refresh token)
   */
  static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  /**
   * Obtenir le profil utilisateur
   */
  static async getProfile(userId: string): Promise<Omit<IUser, "password" | "refreshToken">> {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user.toObject();
  }
}
