import api from "@/lib/axios";
import { RegisterPayload } from "../features/types";

export const registerUser = async (payload: RegisterPayload) => {
  try {
    const response = await api.post("/register", payload);
    return response.data;
  } catch (error: any) {
    // AxiosError typé manuellement
    if (error.response) {
      // Réponse reçue mais avec un code d'erreur (ex: 400, 422, 500)
      const status = error.response.status;
      const message = error.response.data?.message || "Erreur inattendue du serveur.";
      throw new Error(`(${status}) ${message}`);
    } else if (error.request) {
      // Aucune réponse (souvent problème réseau ou serveur off)
      throw new Error("Aucune réponse du serveur. Vérifie ta connexion.");
    } else {
      // Erreur inattendue
      throw new Error(`Erreur inconnue : ${error.message}`);
    }
  }
};
