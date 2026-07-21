import { getBlogs } from "@/actions/admin/blog";
import BlogClient from "./BlogClient";

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 10;

  const { data, totalPages, success } = await getBlogs(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load blog posts.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Blog Posts</h1>
      <BlogClient 
        initialData={data || []} 
        totalPages={totalPages || 1} 
        initialPage={page} 
        initialSearch={search} 
      />
    </div>
  );
}
