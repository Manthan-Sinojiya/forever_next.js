"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Save, Upload, Tag, Loader2 } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  isActive: boolean;
}

interface BrandForm {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  isActive: boolean;
}

const emptyForm: BrandForm = {
  name: "",
  slug: "",
  description: "",
  logo: "",
  isActive: true,
};

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);
  const [formBrand, setFormBrand] = useState<BrandForm>(emptyForm);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      const data = await response.json();
      if (data.success) setBrands(data.data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (res.ok) setBrands(brands.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEditClick = (c: Brand) => {
    setFormBrand({
      _id: c._id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      logo: c.logo || "",
      isActive: c.isActive,
    });
    setFormMode("edit");
    setIsAdding(true);
  };

  const handleStartAdd = () => {
    setFormBrand(emptyForm);
    setFormMode("add");
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setFormBrand(emptyForm);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          setFormBrand({ ...formBrand, logo: data.url });
        } else {
          alert("Upload failed: " + data.error);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  const handleSubmitBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formBrand.name,
        slug: formBrand.slug,
        description: formBrand.description,
        logo: formBrand.logo,
        isActive: formBrand.isActive,
      };

      if (formMode === "add") {
        const res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setBrands([...brands, data.data]);
          setIsAdding(false);
          setFormBrand(emptyForm);
        } else {
          alert(data.error);
        }
      } else {
        const res = await fetch(`/api/brands/${formBrand._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setBrands(brands.map((c) => (c._id === formBrand._id ? data.data : c)));
          setIsAdding(false);
          setFormBrand(emptyForm);
        } else {
          alert(data.error);
        }
      }
    } catch (error) {
      console.error("Error saving brand:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-foreground">Brand Management</h1>
          <button
            onClick={() => {
              if (isAdding) handleCancelForm();
              else handleStartAdd();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              isAdding
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-emerald-650 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
            }`}
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Cancel" : "Add Brand"}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {isAdding && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold font-heading text-slate-800 mb-5 pb-4 border-b border-slate-100">
                {formMode === "add" ? "Add New Brand" : "Edit Brand"}
              </h2>
              <form onSubmit={handleSubmitBrand} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Brand Name *</label>
                    <input
                      required
                      value={formBrand.name}
                      onChange={(e) => setFormBrand({ ...formBrand, name: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. Himalaya"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL Slug (Required)</label>
                    <input
                      value={formBrand.slug}
                      required
                      onChange={(e) => setFormBrand({ ...formBrand, slug: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. himalaya"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Brand Logo</label>
                  <div className="flex items-center gap-4">
                    {formBrand.logo && (
                      <div className="w-16 h-16 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                        <img src={formBrand.logo} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 max-w-sm px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors text-sm font-medium text-slate-700">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>{formBrand.logo ? "Change Logo" : "Upload Logo"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={formBrand.description}
                    onChange={(e) => setFormBrand({ ...formBrand, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium resize-none"
                    placeholder="Short description for this brand..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl transition-all border border-slate-100 w-max">
                    <input
                      type="checkbox"
                      checked={formBrand.isActive}
                      onChange={(e) => setFormBrand({ ...formBrand, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider select-none">Active (Visible to users)</span>
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-650 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Brand</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Brands Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">Create brands to organize your products efficiently.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-left">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {brands.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {c.logo ? (
                              <img src={c.logo} alt={c.name} className="w-10 h-10 rounded-lg object-contain bg-slate-100 p-1" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                {c.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-sm text-slate-800">{c.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{c.slug}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {c.isActive ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    
  );
}
