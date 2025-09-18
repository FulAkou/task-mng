import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth";
import type { LoginData, RegisterData, User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Mutation pour la connexion
  const loginMutation = useMutation((data: LoginData) => authAPI.login(data), {
    onSuccess: (response) => {
      const { user, tokens } = response;

      // Sauvegarder dans localStorage
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Mettre à jour l'état
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Invalider le cache des requêtes
      queryClient.invalidateQueries();

      toast.success("Connexion réussie !");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erreur lors de la connexion";
      toast.error(message);
    },
  });

  // Mutation pour l'inscription
  const registerMutation = useMutation(
    (data: RegisterData) => authAPI.register(data),
    {
      onSuccess: (response) => {
        const { user, tokens } = response;

        // Sauvegarder dans localStorage
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Mettre à jour l'état
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        // Invalider le cache des requêtes
        queryClient.invalidateQueries();

        toast.success("Inscription réussie !");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message || "Erreur lors de l'inscription";
        toast.error(message);
      },
    }
  );

  // Mutation pour la déconnexion
  const logoutMutation = useMutation(() => authAPI.logout(), {
    onSuccess: () => {
      // Nettoyer localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Mettre à jour l'état
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Nettoyer le cache des requêtes
      queryClient.clear();

      toast.success("Déconnexion réussie");
      navigate("/login");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erreur lors de la déconnexion";
      toast.error(message);

      // Forcer la déconnexion même en cas d'erreur
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      queryClient.clear();
      navigate("/login");
    },
  });

  // Fonction de déconnexion
  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  // Fonction de connexion
  const login = useCallback(
    (data: LoginData) => {
      loginMutation.mutate(data);
    },
    [loginMutation]
  );

  // Fonction d'inscription
  const register = useCallback(
    (data: RegisterData) => {
      registerMutation.mutate(data);
    },
    [registerMutation]
  );

  return {
    ...authState,
    login,
    register,
    logout,
    isLoggingIn: loginMutation.isLoading,
    isRegistering: registerMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
  };
};
