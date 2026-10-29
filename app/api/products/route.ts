import { getAllProducts } from "@/services/products";

export async function GET() {
  try {
    const products = await getAllProducts();

    return Response.json({ data: products });
  } catch {
    return Response.json(
      { error: "Unable to load products." },
      { status: 500 },
    );
  }
}
