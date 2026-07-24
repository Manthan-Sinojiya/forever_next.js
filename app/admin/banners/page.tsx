import { getBanners } from "@/actions/admin/banners";
import BannersClient from "./BannersClient";

export default async function BannersPage({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 500;

  const { data, totalPages, success } = await getBanners(search, page, limit);

  if (!success) {
    return <div className="p-4 text-red-600 font-medium">Failed to load banners. Please try again.</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <BannersClient 
        initialData={data || []} 
        totalPages={totalPages || 1} 
        initialPage={page} 
        initialSearch={search} 
      />
    </div>
  );
}
