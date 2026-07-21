import { getCategories } from "@/actions/admin/categories";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 10;

  const { data, totalPages, success } = await getCategories(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load categories.</div>;
  }

  return (
    <CategoriesClient 
      initialData={data || []} 
      totalPages={totalPages || 1} 
      initialPage={page} 
      initialSearch={search} 
    />
  );
}
