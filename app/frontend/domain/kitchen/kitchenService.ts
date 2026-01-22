import axios from "axios";
import { type PaginationMeta } from "types/PaginationMeta";
import type { MatchFormData } from "./MatchFormData";

const API_BASE_URL = `/api/v1/recipes/matching`;
const API_INGREDIENTS_URL = `/api/v1/user_ingredients`;
const API_RECIPES_URL = `/api/v1/recipes/`;

export interface RecipesResponse {
  recipes: import("../recipes/Recipe").Recipe[];
  pagination: PaginationMeta;
}

export interface IngredientsResponse {
  ingredients: import("./Ingredient").Ingredient[];
  title: string;
}

export class KitchenService {
  constructor() { }

  async getIngredients(
    page: number = 1,
    perPage: number = 5
  ): Promise<IngredientsResponse> {
    try {
      const response = await axios.get<IngredientsResponse>(
        API_INGREDIENTS_URL,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
          "An error occurred while fetching ingredients"
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async getDependencies(recipeId: number): Promise<IngredientsResponse> {
    try {
      const response = await axios.get<IngredientsResponse>(
        API_RECIPES_URL + "/" +recipeId + "/dependencies"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
          "An error occurred while fetching dependencies"
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async getRecipes(
    data: MatchFormData,
    page: number = 1,
    perPage: number = 25
  ): Promise<RecipesResponse> {
    try {
      const response = await axios.get<RecipesResponse>(
        API_BASE_URL,
        {
          params: data,
            // page,
            // cook_time_to: 40,
            // cook_time_from: 20,
            // rating_from: 4,
            // rating_to: 5,
            // per_page: perPage,
          // },
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

  async searchRecipe(data: MatchFormData): Promise<any> {
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

export default new KitchenService();
