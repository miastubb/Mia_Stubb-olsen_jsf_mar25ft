import Form from "next/form";
import type { ProductSort as ProductSortValue } from "@/utils/productSort";

interface ProductSortProps {
  sort: ProductSortValue;
}

export default function ProductSort({ sort }: ProductSortProps) {
  return (
    <Form
      action="/"
      className="mb-6 flex flex-wrap items-center gap-3"
    >
      <label htmlFor="product-sort" className="font-medium">
        Sort by
      </label>

      <select
        key={sort}
        id="product-sort"
        name="sort"
        defaultValue={sort}
        className="min-h-11 rounded-md border border-zinc-400 bg-white px-3 py-2 text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
      >
        <option value="default">Default order</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>

      <button
        type="submit"
        className="min-h-11 cursor-pointer rounded-md bg-teal-800 px-4 py-2 font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
      >
        Apply
      </button>
    </Form>
  );
}