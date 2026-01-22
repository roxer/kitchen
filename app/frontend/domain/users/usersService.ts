import axios from "axios";
import { type PaginationMeta } from "../../types/PaginationMeta";

const API_BASE_URL = "/api/users";

export interface UsersResponse {
  users: import("./User").User[];
  pagination: PaginationMeta;
}

class UsersService {
  async getUsers(
    page: number = 1,
    perPage: number = 25
  ): Promise<UsersResponse> {
    try {
      const response = await axios.get<UsersResponse>(API_BASE_URL, {
        params: {
          page,
          per_page: perPage,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
          "An error occurred while fetching users"
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }
}

export default new UsersService();
