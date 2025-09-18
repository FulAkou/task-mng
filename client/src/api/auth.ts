import axios from "axios";
import type {
  ApiResponse,
  AuthResponse,
  LoginData,
  RegisterData,
} from "../types";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  `${window.location.origin}/api/v1`;

// Configuration axios avec intercepteur pour ajouter le token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, essayer de le rafraîchir
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken } = response.data.data;
          localStorage.setItem("accessToken", accessToken);

          // Retenter la requête originale
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          // Refresh token invalide, déconnexion
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    return response.data.data!;
  },

  /**
   * Connexion d'un utilisateur
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data
    );
    return response.data.data!;
  },

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
    return response.data.data!;
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  /**
   * Obtenir le profil utilisateur
   */
  async getProfile(): Promise<AuthResponse["user"]> {
    const response = await api.get<ApiResponse<AuthResponse["user"]>>(
      "/auth/profile"
    );
    return response.data.data!;
  },
};

export default authAPI;
