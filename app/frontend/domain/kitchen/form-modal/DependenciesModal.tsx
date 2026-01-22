import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import kitchenService from "../kitchenService.ts";
import IconX from "~icons/lucide/x";
import type { PaginationMeta } from "../../../types/PaginationMeta";
import type { Ingredient } from "../Ingredient";

interface DependenciesModalProps {
  isOpen: boolean;
  recipeId: number;
  onClose: () => void;
  onSuccess: () => void;
}

function DependenciesModal({ isOpen, onClose, recipeId, onSuccess }: DependenciesModalProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const eventId = params.eventId as string;

  const [error, setError]                       = useState<string | null>(null);
  const [title, setTitle]                       = useState<string | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isLoading, setIsLoading]               = useState(false);
  const [ingredients, setIngredients]           = useState<Ingredient[]>([]);

  const fetchIngredients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await kitchenService.getDependencies(recipeId);
      setIngredients(response.ingredients);
      setTitle(response.title);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Ingredients");
      console.error("Error fetching Ingredients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 z-40 bg-gray-500/50 transition-opacity"
          aria-hidden="true"
          onClick={handleClose}
        ></div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div className="relative z-50 inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
            <div className="border-b border-gray-200 bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Recipe {title}
                </h3>
                <h5>(with Topological sorting)</h5>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <IconX width="24" height="24" />
                </button>
              </div>
            </div>

            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Ingredient (in cooking order)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Deps
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        ({ingredient.id}) {ingredient.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {ingredient.quantity || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {ingredient.dependencies!.join(", ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:gap-2.5 sm:px-6">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-10 w-full items-center justify-center border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default DependenciesModal;
