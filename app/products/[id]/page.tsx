import { Suspense } from "react";
import { getProductById } from "@/services/products";
import Image from "next/image";
import ReviewCarousel from "@/components/ReviewCarousel";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function ProductDetails({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  const hasDiscount =
    product.price > 0 && product.discountedPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex h-80 items-center justify-center overflow-hidden rounded-lg bg-zinc-900 p-6 sm:h-96">
          <Image
            src={product.image.url}
            alt={product.image.alt || product.title}
            width={500}
            height={500}
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="mt-3 flex items-center gap-2">
            <span aria-hidden="true" className="text-amber-400">
              ★
            </span>
            <span className="text-sm font-medium">
              {product.rating.toFixed(1)} / 5
            </span>
          </div>

          <p className="mt-4 leading-relaxed">{product.description}</p>

          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-3xl font-bold">
                {product.discountedPrice.toFixed(2)} kr
              </p>

              {hasDiscount && (
                <>
                  <span className="text-lg text-zinc-700 line-through">
                    {product.price.toFixed(2)} kr
                  </span>

                  <span className="rounded bg-zinc-900 px-3 py-1 text-sm font-semibold text-white">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <section aria-labelledby="reviews-heading" className="mt-12">
        <h2 id="reviews-heading" className="text-2xl font-bold">
          Customer reviews
        </h2>

        <ReviewCarousel reviews={product.reviews} />
      </section>
    </main>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<p className="p-8">Loading product...</p>}>
      <ProductDetails params={params} />
    </Suspense>
  );
}
