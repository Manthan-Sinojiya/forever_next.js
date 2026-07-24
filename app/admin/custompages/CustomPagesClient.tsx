"use client";

import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { deleteCustomPage } from "@/actions/admin/customPages";
import toast from "react-hot-toast";

export default function CustomPagesClient({ initialData, totalPages, initialPage, initialSearch }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const columns = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "slug", header: "Slug" },
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
    if (window.confirm("Are you sure you want to delete this custom page?")) {
      const res = await deleteCustomPage(id);
      if (res.success) {
        toast.success("Page deleted successfully!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete page");
      }
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={initialData}
        pageCount={totalPages}
        createHref="/admin/custompages/new"
        onDelete={handleDelete}
        onGlobalFilterChange={handleGlobalFilterChange}
        onPaginationChange={handlePaginationChange}
        globalFilter={initialSearch}
        pagination={{ pageIndex: initialPage - 1, pageSize: 10 }}
        searchKey="title"
      />
    </>
  );
}
