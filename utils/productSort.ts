export type ProductSort = "default" | "price-asc" | "price-desc";

export function parseProductSort(
  value: string | string[] | undefined,
): ProductSort {
  if (value === "price-asc" || value === "price-desc") {
    return value;
  }

  return "default";
}
