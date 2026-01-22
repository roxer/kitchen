import axios from "axios";
import { type PaginationMeta } from "types/PaginationMeta";
import type { VehicleFormData } from "./form-modal/VehicleFormData";

const API_BASE_URL = `/api/v1/recipes`;

export interface RecipesResponse {
  recipes: import("./Recipe").Recipe[];
  pagination: PaginationMeta;
}
export class RecipesService {
  constructor() { }

  async getRecipes(
    page: number = 1,
    perPage: number = 25
  ): Promise<RecipesResponse> {
    try {
      const response = await axios.get<RecipesResponse>(
        API_BASE_URL,
        {
          params: {
            page,
            per_page: perPage,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
          "An error occurred while fetching recipes"
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async createRecipe(eventId: string, data: VehicleFormData): Promise<any> {
    try {
      const response = await axios.post(
        API_BASE_URL,
        {
          recipe: data,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.errors?.join(", ") ||
          error.response?.data?.error ||
          "An error occurred while creating the recipe"
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }
}

export default new RecipesService();
