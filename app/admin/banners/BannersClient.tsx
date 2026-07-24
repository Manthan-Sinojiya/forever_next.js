"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteBanner } from "@/actions/admin/banners";
import { Image as ImageIcon, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const POSITION_LABELS: Record<string, string> = {
  "about-us": "About Us Page",
  "categories-overview": "Categories Overview",
  "category-specific": "Category Wise (Specific)",
  "products-overview": "Products Overview / Shop",
  "product-specific": "Product Wise (Specific)",
  "homepage-top": "Homepage Top",
  "homepage-mid": "Homepage Middle",
  "Homepage": "Homepage Top",
  "Category": "Category Wise",
  "Product": "Product Wise",
};

export default function BannersClient({ initialData }: any) {
  const router = useRouter();

  const columns = [
    {
      key: "title",
      label: "Banner Details",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {row.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.image} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900 line-clamp-1">{row.title}</div>
            {row.subtitle && <div className="text-xs text-slate-500 line-clamp-1">{row.subtitle}</div>}
          </div>
        </div>
      ),
    },
    {
      key: "position",
      label: "Placement / Position",
      render: (row: any) => {
        const label = POSITION_LABELS[row.position] || row.position;
        const target = row.targetCategory || row.targetProduct;

        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80 w-fit">
              {label}
            </span>
            {target && (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                Target: {target}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => {
        const isActive = row.isActive !== false;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      key: "link",
      label: "CTA Link",
      render: (row: any) => (
        <span className="text-xs text-slate-500 font-mono">
          {row.link ? (
            <a href={row.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600">
              {row.link} <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            "—"
          )}
        </span>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      const loadingToast = toast.loading("Deleting banner...");
      try {
        await deleteBanner(id);
        toast.success("Banner deleted successfully", { id: loadingToast });
        router.refresh();
      } catch (error) {
        toast.error("Failed to delete banner", { id: loadingToast });
      }
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Banner Management</h1>
          <p className="text-slate-500 mt-1">
            Manage dynamic banners for About Us, Categories, Category Wise, Products, & Product Wise pages.
          </p>
        </div>
      </div>

      <DataTable
        title="All Banners"
        columns={columns}
        data={initialData || []}
        createHref="/admin/banners/new"
        onDelete={handleDelete}
        searchPlaceholder="Search banners by title..."
      />
    </div>
  );
}
