import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { PaginationMeta } from "../types/PaginationMeta";
import IconChevronLeft from "~icons/lucide/chevron-left";
import IconChevronRight from "~icons/lucide/chevron-right";

interface PaginationProps {
  pagination: PaginationMeta | null;
  currentPage: number;
  perPage: number;
  onPageChange?: (page: number) => void;
  getPageLink?: (page: number) => string;
}

function Pagination({
  pagination,
  currentPage,
  perPage,
  onPageChange,
  getPageLink,
}: PaginationProps) {
  const startIndex = useMemo(() => {
    if (!pagination) return 0;
    return (currentPage - 1) * perPage + 1;
  }, [pagination, currentPage, perPage]);

  const endIndex = useMemo(() => {
    if (!pagination) return 0;
    return Math.min(currentPage * perPage, pagination.total_count);
  }, [pagination, currentPage, perPage]);

  const visiblePages = useMemo(() => {
    if (!pagination) return [];
    const total = pagination.total_pages;
    const current = currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 3; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }, [pagination, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || (pagination && page > pagination.total_pages)) {
      return;
    }
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const getTargetLink = (page: number) => {
    if (!getPageLink) return "#";
    if (page < 1 || (pagination && page > pagination.total_pages)) {
      return "#"; // Disable link effectively or handle via pointer-events
    }
    return getPageLink(page);
  };

  if (!pagination || pagination.total_pages <= 1) {
    return null;
  }

  const renderPageButton = (page: number, content: React.ReactNode, isCurrent: boolean = false, className: string = "") => {
    const disabled = page < 1 || page > pagination.total_pages;

    if (getPageLink && !disabled) {
      return (
        <Link
          to={getTargetLink(page)}
          className={`${className} ${isCurrent
              ? "z-10 border-indigo-500 bg-indigo-50 text-indigo-600"
              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            }`}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={() => handlePageChange(page)}
        disabled={disabled}
        className={`${className} ${isCurrent
            ? "z-10 border-indigo-500 bg-indigo-50 text-indigo-600" // Button specific current style if needed, reusing mapped style
            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        {renderPageButton(currentPage - 1, "Previous", false, "relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium")}
        {renderPageButton(currentPage + 1, "Next", false, "relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ml-3")}
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{pagination.total_count}</span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {renderPageButton(currentPage - 1, (
              <>
                <span className="sr-only">Previous</span>
                <IconChevronLeft className="h-5 w-5" aria-hidden="true" />
              </>
            ), false, "relative inline-flex items-center rounded-l-md border px-2 py-2 text-sm font-medium")}

            {visiblePages.map((page, index) =>
              page !== -1 ? (
                renderPageButton(page, page, page === currentPage, "relative inline-flex items-center border px-4 py-2 text-sm font-medium")
              ) : (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              )
            )}

            {renderPageButton(currentPage + 1, (
              <>
                <span className="sr-only">Next</span>
                <IconChevronRight className="h-5 w-5" aria-hidden="true" />
              </>
            ), false, "relative inline-flex items-center rounded-r-md border px-2 py-2 text-sm font-medium")}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
