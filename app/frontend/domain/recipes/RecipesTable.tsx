import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import recipesService, { type RecipesResponse } from "./recipesService";
import type { Recipe } from "./Recipe";
import Pagination from "../../components/Pagination";
import type { PaginationMeta } from "../../types/PaginationMeta";
import IconChevronLeft from "~icons/lucide/chevron-left";
import IconChevronRight from "~icons/lucide/chevron-right";

function RecipesTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 10;

  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1");
    return Math.max(1, page);
  }, [searchParams]);

  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await recipesService.getRecipes(currentPage, perPage);
      setRecipes(response.recipes);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Recipes");
      console.error("Error fetching Recipes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPageLink = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    return `?${newParams.toString()}`;
  };

  const handleRecipeCreated = () => {
    fetchRecipes();
  };

  useEffect(() => {
    fetchRecipes();
  }, [currentPage]);

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">Recipes</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Add Recipe
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
            <div>
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading recipes...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
            <div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchRecipes}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Recipes table */}
        {!isLoading && !error && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Cook Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Preparation Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Author
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recipes.map((recipe) => (
                    <tr key={recipe.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {recipe.title || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        <img src={recipe.image_url || "-"} width={40} height={40} alt='food' />
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {recipe.cook_time || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {recipe.prep_time || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {recipe.rating || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {recipe.author_name || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              perPage={perPage}
              getPageLink={getPageLink}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipesTable;
