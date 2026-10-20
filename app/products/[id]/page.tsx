import { Suspense } from "react";
import { getProductById } from "@/services/products";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function ProductDetails({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

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
          <p className="mt-4 leading-relaxed">{product.description}</p>
        </div>
      </div>
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
