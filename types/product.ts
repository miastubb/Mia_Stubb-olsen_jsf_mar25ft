export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  rating: number;
  image: {
    url: string;
    alt: string;
  };
  tags: string[];
  reviews: {
    id: string;
    username: string;
    rating: number;
    description: string;
  }[];
}

export interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

export interface PaginatedProducts {
  data: Product[];
  meta: PaginationMeta;
}
