import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import ProductRating from "@/components/ProductRating";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountedPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100">
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <Image
            src={product.image.url}
            alt={product.image.alt}
            width={400}
            height={400}
            className="aspect-square w-full object-cover"
          />

          {hasDiscount && (
            <span className="absolute top-3 left-3 rounded bg-zinc-800 px-3 py-1 text-sm font-semibold text-white">
              -{discountPercentage}%
            </span>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold">{product.title}</h2>

          <ProductRating
            rating={product.rating}
            reviewCount={product.reviews.length}
            className="mt-2"
          />
          <p className="text-lg font-bold">
            {formatCurrency(product.discountedPrice)}
          </p>

          {hasDiscount && (
            <p className="text-sm text-zinc-400 line-through">
              {formatCurrency(product.price)}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
