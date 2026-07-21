"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteMenu, createMenu } from "@/actions/admin/navigation";
import { Navigation, Link as LinkIcon, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function NavigationClient({ initialData }: any) {
  const router = useRouter();
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      await deleteMenu(id);
      router.refresh();
    }
  };

  const handleCreateNew = async () => {
    const name = window.prompt("Enter new menu name (e.g., 'Main Header'):");
    if (!name) return;
    
    const res = await createMenu({ name, links: [] });
    if (res.success && res.data) {
      router.push(`/admin/navigation/${res.data}`);
    } else {
      alert("Failed to create menu.");
    }
  };

  const columns = [
    { 
      key: "name", 
      label: "Menu Profile",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-500 font-medium">Menu System</div>
          </div>
        </div>
      )
    },
    { 
      key: "links", 
      label: "Navigation Links",
      render: (row: any) => {
        const count = row.links?.length || 0;
        return (
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <LinkIcon className="w-4 h-4 text-slate-400" />
            {count} link{count !== 1 ? 's' : ''} configured
          </div>
        );
      }
    },
    {
      key: "actions",
      label: "",
      render: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/navigation/${row._id}`}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Menu"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Menu"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Navigation Builder</h1>
          <p className="text-slate-500 mt-1">Manage website menus and navigation structure.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm shadow-indigo-200"
        >
          Add New Menu
        </button>
      </div>
      
      <DataTable
        title="Menu Directories"
        columns={columns}
        data={initialData}
        searchPlaceholder="Search menus by name..."
      />
    </div>
  );
}
