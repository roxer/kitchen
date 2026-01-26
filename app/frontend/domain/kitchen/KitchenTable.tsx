import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import kitchenService, { type RecipesResponse } from "./kitchenService";
import type { Recipe } from "./../recipes/Recipe";
import IngredientsModal from "@domain/kitchen/form-modal/IngredientsModal";
import DependenciesModal from "@domain/kitchen/form-modal/DependenciesModal";
import Pagination from "../../components/Pagination";
import type { PaginationMeta } from "../../types/PaginationMeta";
import IconChevronLeft from "~icons/lucide/chevron-left";
import IconChevronRight from "~icons/lucide/chevron-right";
import {RangeSlider} from '@react-spectrum/s2';
import type { MatchFormData } from "./MatchFormData";
import sygnet2 from "@assets/images/popup-svgrepo-com.svg";

function RecipesTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [recipes, setRecipes]         = useState<Recipe[]>([]);
  const [recipeId, setRecipeId]       = useState<number | null>(null);
  const [pagination, setPagination]   = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curCookTime, setCurCookTime] = useState({start: 1, end: 800});
  const [finCookTime, setFinCookTime] = useState(curCookTime);
  const [curPrepTime, setCurPrepTime] = useState({start: 1, end: 800});
  const [finPrepTime, setFinPrepTime] = useState(curPrepTime);
  const [curRating, setCurRating]     = useState({start: 0, end: 5});
  const [finRating, setFinRating]     = useState(curRating);
  const [nameMatch, setNameMatch]     = useState<string | null>(null);
  const perPage = 10;

  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1");
    return Math.max(1, page);
  }, [searchParams]);

  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);
    var submitData:MatchFormData = {}
    if (finCookTime.start != 1 || finCookTime.end != 800) {
      submitData.cook_time_start = finCookTime.start;
      submitData.cook_time_end = finCookTime.end;
    }
    if (finPrepTime.start != 1 || finPrepTime.end != 800) {
      submitData.prep_time_start = finPrepTime.start;
      submitData.prep_time_end = finPrepTime.end;
    }
    if (finRating.start != 0 || finRating.end != 5) {
      submitData.rating_start = finRating.start;
      submitData.rating_end = finRating.end;
    }
    if (nameMatch != null) {
      submitData.name_match = nameMatch;
    }

    try {
      const response = await kitchenService.getRecipes(submitData);
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

  const handleRecipeFilter = () => {
    fetchRecipes();
  };

  const handleDependenciesModal = (rid: number) => {
    setRecipeId(rid);
    setIsRecipeModalOpen(true);
  };

  const IMG_URL = "https://placehold.net/3.png"; // img placeholder
  const decodeImageURI = (url: string) => {
    const chunks: string[] = url.split("=");

    return decodeURIComponent(chunks[1] || "") || IMG_URL;
  };

  // useEffect(() => {
  //   fetchRecipes();
  // }, [currentPage]);

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">My Kitchen</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Show My Ingredients
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

        <div className="grid grid-cols-3">
        <div className="px-6 py-3 w-xs">
          <RangeSlider
            label="Cook Time (in minutes)"
            isEmphasized={true}
            maxValue={800}
            value={curCookTime}
            onChange={setCurCookTime}
            onChangeEnd={setFinCookTime}
          />
        </div>
        <div className="px-6 py-3 w-xs">
          <RangeSlider
            label="Preparation Time (in minutes)"
            isEmphasized={true}
            maxValue={800}
            value={curPrepTime}
            onChange={setCurPrepTime}
            onChangeEnd={setFinPrepTime}
          />
        </div>
        <div className="px-6 py-3 w-xs">
          <RangeSlider
            label="Rating"
            isEmphasized={true}
            maxValue={5}
            step={0.1}
            value={curRating}
            onChange={setCurRating}
            onChangeEnd={setFinRating}
          />
        </div>
        </div>
        <div className="grid grid-cols-3 px-8">
        <div>
        Title contains text
        <input
          id="nameMatch"
          value={nameMatch || ""}
          onChange={(e) => setNameMatch(e.target.value)}
          className="mt-1 block w-full border rounded border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        </div>
        <div className="py-8 px-8" >
          Shows recipes I can cook with my ingredients
        </div>
        <div className="px-6 py-1 w-xs">
          <button
            onClick={fetchRecipes}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
        </div>

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
                        <button onClick={() => handleDependenciesModal(recipe.id)}
                          className="cursor-pointer underline color-blue "
                        >
                          {recipe.title || "—"}
                          <img src={sygnet2}
                               alt="Logo"
                               className="inline-block mb-6 h-4 bg-cyan-300 hover:bg-orange-400 cursor-pointer"
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        <img
                          src={decodeImageURI(recipe.image || "")}
                          width={40} height={40}
                          className="cursor-pointer"
                          onClick={() => handleDependenciesModal(recipe.id)}
                          alt='food' />
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

      {/* Ingredients Modal */}
      <IngredientsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRecipeFilter}
      />
      {/* Recipe Modal */}
      <DependenciesModal
        isOpen={isRecipeModalOpen}
        recipeId={recipeId}
        onClose={() => setIsRecipeModalOpen(false)}
        onSuccess={handleRecipeFilter}
      />
    </div>
  );
}

export default RecipesTable;
