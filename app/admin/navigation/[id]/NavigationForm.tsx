"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { updateMenu } from "@/actions/admin/navigation";

export default function NavigationForm({ menu }: { menu: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      name: menu.name || "Main Desktop Menu",
      isActive: true,
      links: menu.links?.length ? menu.links : [
        { label: "Categories", url: "/categories", subItems: [] },
        { label: "New Item", url: "/", subItems: [
          { label: "New Item", url: "/" },
          { label: "New Item", url: "/" }
        ] }
      ],
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "links"
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        ...data,
        links: data.links.map((link: any, index: number) => ({ ...link, order: index }))
      };
      
      const res = await updateMenu(menu._id, payload);
      if (res.success) {
        router.push("/admin/navigation");
        router.refresh();
      } else {
        setError(res.error || "Failed to update menu");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Menu Builder</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your storefront navigation structure.</p>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-sm hover:bg-emerald-700 disabled:opacity-70 font-medium transition-colors"
        >
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Menu"}
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
      
      {/* Menu Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Menu Settings</h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex-1 w-full max-w-2xl">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Internal Name</label>
            <input 
              {...register("name", { required: "Name is required" })} 
              className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
            />
          </div>
          
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4 w-full md:w-64">
            <div>
              <div className="text-sm font-semibold text-slate-800">Active Status</div>
              <div className="text-xs text-slate-500">Set as live menu</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register("isActive")} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Navigation Tree</h3>
          <button
            type="button"
            onClick={() => append({ label: "", url: "", subItems: [] } as any)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Add Root Item
          </button>
        </div>

        <div className="space-y-4">
          {fields.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4 text-center">No links added yet. Click "+ Add Root Item" to get started.</p>
          ) : (
            fields.map((field: any, index) => {
              return (
              <div key={field.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="cursor-ns-resize text-slate-400 hover:text-slate-600 transition-colors">
                    <GripVertical size={20} />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input
                      {...register(`links.${index}.label`, { required: true })}
                      placeholder="Label"
                      className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white"
                    />
                    <input
                      {...register(`links.${index}.url`, { required: true })}
                      placeholder="URL path"
                      className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {/* Sub Items Mockup */}
                {watch(`links.${index}.subItems`) && watch(`links.${index}.subItems`).length > 0 && (
                  <div className="mt-3 ml-8 space-y-3">
                    {watch(`links.${index}.subItems`).map((sub: any, subIndex: number) => (
                      <div key={subIndex} className="flex items-center gap-4">
                        <div className="w-4 h-4 border-l-2 border-b-2 border-slate-300 rounded-bl" />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <input
                            {...register(`links.${index}.subItems.${subIndex}.label`)}
                            defaultValue={sub.label}
                            placeholder="Label"
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white"
                          />
                          <input
                            {...register(`links.${index}.subItems.${subIndex}.url`)}
                            defaultValue={sub.url}
                            placeholder="URL path"
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white"
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => {
                            const currentSubItems = getValues(`links.${index}.subItems`) || [];
                            const newSubItems = currentSubItems.filter((_: any, i: number) => i !== subIndex);
                            setValue(`links.${index}.subItems`, newSubItems);
                          }}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-3 ml-8">
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentSubItems = getValues(`links.${index}.subItems`) || [];
                      setValue(`links.${index}.subItems`, [...currentSubItems, { label: "", url: "" }]);
                    }}
                    className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                  >
                    <Plus size={16} /> Add Sub Item
                  </button>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </form>
  );
}
