

// Payload envoyé à l'API lors de l'inscription
export interface RegisterPayload {
    full_name: string,
    email: string;
    password: string;
    phone_number: string;

  }
  
  // Payload pour la connexion
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  // Réponse attendue après login/register
  export interface AuthResponse {
    user: {
      id: number;
      full_name: string;
      email: string;
      phone_number: string;
    };
    token: string;
  }
  