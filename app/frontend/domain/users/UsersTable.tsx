// Placeholder component - needs full implementation
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import usersService, { type UsersResponse } from "./usersService";
import type { User } from "./User";
import dayjs from "../../utils/dayjs";
import Pagination from "../../components/Pagination";
import type { PaginationMeta } from "../../types/PaginationMeta";
import IconLoader2 from "~icons/lucide/loader-2";

function UsersTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 25;

  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1");
    return Math.max(1, page);
  }, [searchParams]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await usersService.getUsers(currentPage, perPage);
      setUsers(response.users);
      // Ideally response.pagination matches PaginationMeta, but we might need to cast or adapt if types mismatch strictly
      // Assuming usersService returns what we expect
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "—";
    try {
      return dayjs.utc(dateString).local().format("MMM D, YYYY h:mm A");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow">
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">Users</h2>
        </div>

        {/* Loading state */}
        {isLoading && users.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
            <div>
              <IconLoader2 className="inline-block h-8 w-8 animate-spin text-indigo-600" />
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : error ? (
          /* Error state */
          <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
            <div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          /* Users table */
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Surname
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Archived At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {user.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {user.surname || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${user.archived_at
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                            }`}
                        >
                          {user.archived_at ? "Archived" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {formatDate(user.archived_at)}
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
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersTable;
