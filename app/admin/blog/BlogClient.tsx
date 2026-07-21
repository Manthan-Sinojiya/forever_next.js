"use client";

import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { deleteBlog } from "@/actions/admin/blog";

export default function BlogClient({ initialData, totalPages, initialPage, initialSearch }: any) {
  const router = useRouter();
  const pathname = usePathname();
  
  const columns = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "status", header: "Status" },
  ];

  const handleGlobalFilterChange = (search: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePaginationChange = (updater: any) => {
    const nextState = typeof updater === "function" ? updater({ pageIndex: initialPage - 1, pageSize: 10 }) : updater;
    const params = new URLSearchParams();
    if (initialSearch) params.set("search", initialSearch);
    params.set("page", (nextState.pageIndex + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlog(id);
    }
  };

  return (
    <DataTable
      columns={columns}
      data={initialData}
      pageCount={totalPages}
      createHref="/admin/blog/new"
      onDelete={handleDelete}
      onGlobalFilterChange={handleGlobalFilterChange}
      onPaginationChange={handlePaginationChange}
      globalFilter={initialSearch}
      pagination={{ pageIndex: initialPage - 1, pageSize: 10 }}
      searchKey="title"
    />
  );
}
