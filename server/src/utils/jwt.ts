import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "fallback-secret";
  private static readonly REFRESH_TOKEN_SECRET =
    process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret";
  private static readonly ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
  private static readonly REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  /**
   * Génère une paire de tokens (access + refresh)
   */
  static generateTokenPair(user: IUser): TokenPair {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const accessToken = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN as import("ms").StringValue,
    });

    const refreshToken = jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN as import("ms").StringValue,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Vérifie un access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Token d'accès invalide");
    }
  }

  /**
   * Vérifie un refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Refresh token invalide");
    }
  }

  /**
   * Génère un nouvel access token à partir d'un refresh token
   */
  static refreshAccessToken(refreshToken: string): string {
    const payload = this.verifyRefreshToken(refreshToken);

    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN as import("ms").StringValue,
    });
  }
}
