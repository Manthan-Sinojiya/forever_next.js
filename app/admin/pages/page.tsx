"use client";

import { useState, useEffect } from "react";
import { Plus, X, FileText, Image as ImageIcon } from "lucide-react";

export default function AdminPagesBuilder() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Page State
  const [formPage, setFormPage] = useState<any>({
    title: "",
    slug: "",
    content: "",
    topBannerImage: "",
    topBannerLink: "",
    bottomBannerImage: "",
    bottomBannerLink: "",
    customCSS: "",
    metaTitle: "",
    metaDescription: "",
    isActive: true
  });

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/admin/pages");
      const data = await response.json();
      if (data.success) {
        setPages(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = !!formPage._id;
      const url = isEdit ? `/api/admin/pages/${formPage._id}` : "/api/admin/pages";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPage),
      });
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setPages(pages.map(p => p._id === data.data._id ? data.data : p));
        } else {
          setPages([data.data, ...pages]);
        }
        setIsAdding(false);
        setFormPage({
          title: "", slug: "", content: "", topBannerImage: "", topBannerLink: "",
          bottomBannerImage: "", bottomBannerLink: "", customCSS: "", metaTitle: "", metaDescription: "", isActive: true
        });
        alert("Page saved successfully!");
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "topBannerImage" | "bottomBannerImage") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          setFormPage({ ...formPage, [field]: data.url });
        } else {
          alert("Upload failed: " + data.error);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this page?")) return;
    try {
      await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      setPages(pages.filter(p => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold font-heading text-slate-800">Pages Builder</h1>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Cancel" : "Create New Page"}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1 max-w-4xl mx-auto w-full pb-20">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isAdding ? (
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-10">
              
              {/* Basic Content */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Page Title</label>
                  <input
                    required
                    type="text"
                    value={formPage.title}
                    onChange={(e) => setFormPage({...formPage, title: e.target.value})}
                    placeholder="e.g. About Us"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Content (HTML allowed)</label>
                  <textarea
                    value={formPage.content}
                    onChange={(e) => setFormPage({...formPage, content: e.target.value})}
                    placeholder="<p>Welcome to our store...</p>"
                    rows={12}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm font-mono resize-y"
                  />
                </div>
              </div>

              {/* Page Banners */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Page Banners</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Top Banner */}
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Top / First Banner</label>
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 relative overflow-hidden shrink-0">
                        {formPage.topBannerImage ? (
                          <img src={formPage.topBannerImage} alt="Top Banner" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <label className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                        Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "topBannerImage")} />
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Banner Link</label>
                      <input
                        type="text"
                        value={formPage.topBannerLink}
                        onChange={(e) => setFormPage({...formPage, topBannerLink: e.target.value})}
                        placeholder="e.g. /products?category=ink"
                        className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Bottom Banner */}
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Bottom / Last Banner</label>
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 relative overflow-hidden shrink-0">
                        {formPage.bottomBannerImage ? (
                          <img src={formPage.bottomBannerImage} alt="Bottom Banner" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <label className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                        Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "bottomBannerImage")} />
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Banner Link</label>
                      <input
                        type="text"
                        value={formPage.bottomBannerLink}
                        onChange={(e) => setFormPage({...formPage, bottomBannerLink: e.target.value})}
                        placeholder="e.g. /products?category=toner"
                        className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom CSS */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Custom CSS</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Page-Specific Styles (CSS)</label>
                  <textarea
                    value={formPage.customCSS}
                    onChange={(e) => setFormPage({...formPage, customCSS: e.target.value})}
                    placeholder={`.custom-class {\n  background: #f0f;\n}`}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm font-mono text-slate-600 resize-y"
                  />
                </div>
              </div>

              {/* SEO Metadata */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">SEO Metadata</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formPage.metaTitle}
                    onChange={(e) => setFormPage({...formPage, metaTitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Meta Description</label>
                  <textarea
                    value={formPage.metaDescription}
                    onChange={(e) => setFormPage({...formPage, metaDescription: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Page"}
                </button>
              </div>

            </form>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-left">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Page Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Slug</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pages.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">{p.title}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">/{p.slug}</td>
                      <td className="px-6 py-4 text-right space-x-3 text-sm font-bold">
                        <button onClick={() => { setFormPage(p); setIsAdding(true); }} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {pages.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-400">No custom pages created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    
  );
}
