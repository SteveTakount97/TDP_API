"use client";

import { useState } from "react";
import { registerUser } from "@/services/authService";
import { RegisterPayload } from "@/features/types";

type RegisterErrorType =
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

interface RegisterError {
  type: RegisterErrorType;
  message: string;
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RegisterError | null>(null);

  const handleRegister = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(payload);
      return data;
    } catch (err: any) {
      let parsedError: RegisterError = {
        type: "UNKNOWN_ERROR",
        message: "Une erreur inattendue est survenue.",
      };

      if (err.response) {
        const status = err.response.status;

        if (status === 400) {
          parsedError = {
            type: "VALIDATION_ERROR",
            message: err.response.data.message || "Données invalides.",
          };
        } else if (status >= 500) {
          parsedError = {
            type: "SERVER_ERROR",
            message: "Erreur interne du serveur. Veuillez réessayer plus tard.",
          };
        } else {
          parsedError = {
            type: "UNKNOWN_ERROR",
            message: err.response.data.message || "Erreur non gérée.",
          };
        }
      } else if (err.request) {
        parsedError = {
          type: "NETWORK_ERROR",
          message: "Impossible de joindre le serveur. Vérifiez votre connexion.",
        };
      }

      setError(parsedError);
      throw err; // pour laisser le composant réagir si nécessaire
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};
