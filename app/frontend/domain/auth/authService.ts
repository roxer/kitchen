import axios from "axios";
import type { User } from "../users/User";

const API_BASE_URL = "/api/session";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

class AuthService {
  async signIn(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/sign_in`,
        {
          user: credentials,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const authError: AuthError = {
          message:
            error.response?.data?.error || "An error occurred during sign in",
          errors: error.response?.data?.errors,
        };
        throw authError;
      }
      throw {
        message: "An unexpected error occurred",
      } as AuthError;
    }
  }

  async signOut(): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/sign_out`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const authError: AuthError = {
          message:
            error.response?.data?.error || "An error occurred during sign out",
        };
        throw authError;
      }
      throw {
        message: "An unexpected error occurred",
      } as AuthError;
    }
  }
}

export default new AuthService();
