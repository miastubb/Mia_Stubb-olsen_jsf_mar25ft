import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border">
      <Link href={`/products/${product.id}`}>
        <Image
          src={product.image.url}
          alt={product.image.alt}
          width={400}
          height={400}
          className="aspect-square w-full object-cover"
        />

        <div className="p-4">
          <h2 className="text-lg font-semibold">{product.title}</h2>

          <p className="mt-2 font-bold">
            {product.discountedPrice.toFixed(2)} kr
          </p>
        </div>
      </Link>
    </article>
  );
}
