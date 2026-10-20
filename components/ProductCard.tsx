import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

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

          <div className="mt-2 flex items-center gap-2">
            <div className="mt-2 flex items-center gap-2">
              <span aria-hidden="true" className="text-amber-400">
                ★
              </span>
              <span className="text-sm text-zinc-300">
                {product.rating.toFixed(1)} / 5
              </span>
            </div>
            <p className="text-lg font-bold">
              {product.discountedPrice.toFixed(2)} kr
            </p>

            {hasDiscount && (
              <p className="text-sm text-zinc-400 line-through">
                {product.price.toFixed(2)} kr
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
