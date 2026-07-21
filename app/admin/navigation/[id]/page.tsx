import { getMenuById } from "@/actions/admin/navigation";
import NavigationForm from "./NavigationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditNavigationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data: menu, success } = await getMenuById(resolvedParams.id);

  if (!success || !menu) {
    return <div className="p-4">Failed to load menu or it doesn't exist.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/navigation" className="text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Menu: {menu.name}</h1>
      </div>
      
      <NavigationForm menu={menu} />
    </div>
  );
}
