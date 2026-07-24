import { getProducts } from "@/actions/admin/products";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 1000;

  const { data, totalPages, success } = await getProducts(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load products.</div>;
  }

  return (
    <ProductsClient 
      initialData={data || []} 
      totalPages={totalPages || 1} 
      initialPage={page} 
      initialSearch={search} 
    />
  );
}
