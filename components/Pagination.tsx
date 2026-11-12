import Link from "next/link";
import type { PaginationMeta } from "@/types/product";
import type { ProductSort } from "@/utils/productSort";

interface PaginationProps {
  meta: PaginationMeta;
  sort?: ProductSort;
}

export default function Pagination({
  meta,
  sort = "default",
}: PaginationProps) {
  const { currentPage, pageCount, isFirstPage, isLastPage } = meta;

  function getPageHref(page: number): string {
    const params = new URLSearchParams({ page: String(page) });

    if (sort !== "default") {
      params.set("sort", sort);
    }

    return `/?${params.toString()}`;
  }

  return (
    <nav aria-label="Product pagination" className="mt-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isFirstPage && (
          <Link
            href={getPageHref(currentPage - 1)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Previous
          </Link>
        )}

        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {pageCount}
        </span>

        {!isLastPage && (
          <Link
            href={getPageHref(currentPage + 1)}
            className="rounded-md border border-gray-500 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
