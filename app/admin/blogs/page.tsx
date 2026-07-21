"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Save, Upload, FileText, Calendar, Loader2 } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
}

interface BlogForm {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  tags: string;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
}

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  content: "",
  image: "",
  author: "Forever Healthcare Admin",
  tags: "",
  isPublished: true,
  seoTitle: "",
  seoDescription: "",
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);
  const [formBlog, setFormBlog] = useState<BlogForm>(emptyForm);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs");
      const data = await response.json();
      if (data.success) setBlogs(data.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (res.ok) setBlogs(blogs.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEditClick = (b: Blog) => {
    setFormBlog({
      _id: b._id,
      title: b.title,
      slug: b.slug,
      content: b.content,
      image: b.image || "",
      author: b.author || "Forever Healthcare Admin",
      tags: b.tags ? b.tags.join(", ") : "",
      isPublished: b.isPublished,
      seoTitle: b.seoTitle || "",
      seoDescription: b.seoDescription || "",
    });
    setFormMode("edit");
    setIsAdding(true);
  };

  const handleStartAdd = () => {
    setFormBlog(emptyForm);
    setFormMode("add");
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setFormBlog(emptyForm);
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
          setFormBlog({ ...formBlog, image: data.url });
        } else {
          alert("Upload failed: " + data.error);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBlog.content) {
      alert("Blog content is required.");
      return;
    }
    setSaving(true);

    try {
      const payload = {
        title: formBlog.title,
        slug: formBlog.slug,
        content: formBlog.content,
        image: formBlog.image,
        author: formBlog.author,
        tags: formBlog.tags,
        isPublished: formBlog.isPublished,
        seoTitle: formBlog.seoTitle,
        seoDescription: formBlog.seoDescription,
      };

      if (formMode === "add") {
        const res = await fetch("/api/admin/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setBlogs([data.data, ...blogs]);
          setIsAdding(false);
          setFormBlog(emptyForm);
        } else {
          alert(data.error);
        }
      } else {
        const res = await fetch(`/api/admin/blogs/${formBlog._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setBlogs(blogs.map((b) => (b._id === formBlog._id ? data.data : b)));
          setIsAdding(false);
          setFormBlog(emptyForm);
        } else {
          alert(data.error);
        }
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-foreground">Blog Management</h1>
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
            {isAdding ? "Cancel" : "Add Post"}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {isAdding && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold font-heading text-slate-800 mb-5 pb-4 border-b border-slate-100">
                {formMode === "add" ? "Create New Blog Post" : "Edit Blog Post"}
              </h2>
              <form onSubmit={handleSubmitBlog} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Post Title *</label>
                    <input
                      required
                      value={formBlog.title}
                      onChange={(e) => setFormBlog({ ...formBlog, title: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. 5 Benefits of Ashwagandha"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL Slug (Optional - Auto generated)</label>
                    <input
                      value={formBlog.slug}
                      onChange={(e) => setFormBlog({ ...formBlog, slug: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. 5-benefits-of-ashwagandha"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Author</label>
                    <input
                      required
                      value={formBlog.author}
                      onChange={(e) => setFormBlog({ ...formBlog, author: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tags (comma separated)</label>
                    <input
                      value={formBlog.tags}
                      onChange={(e) => setFormBlog({ ...formBlog, tags: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. Health, Ayurveda, Immunity"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Featured Image</label>
                  <div className="flex items-center gap-4">
                    {formBlog.image && (
                      <div className="w-24 h-16 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                        <img src={formBlog.image} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      )}
                    <label className="flex items-center justify-center gap-2 max-w-sm px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors text-sm font-medium text-slate-700">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>{formBlog.image ? "Change Image" : "Upload Image"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Blog Content * (Rich Text)</label>
                  <RichTextEditor 
                    value={formBlog.content}
                    onChange={(val) => setFormBlog({ ...formBlog, content: val })}
                  />
                </div>

                <div className="border-t border-slate-100 pt-5 mt-2">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">SEO Metadata</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">SEO Title</label>
                      <input
                        value={formBlog.seoTitle}
                        onChange={(e) => setFormBlog({ ...formBlog, seoTitle: e.target.value })}
                        type="text"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                        placeholder="Meta title for search engines"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">SEO Description</label>
                      <input
                        value={formBlog.seoDescription}
                        onChange={(e) => setFormBlog({ ...formBlog, seoDescription: e.target.value })}
                        type="text"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                        placeholder="Meta description for search engines"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl transition-all border border-slate-100 w-max">
                    <input
                      type="checkbox"
                      checked={formBlog.isPublished}
                      onChange={(e) => setFormBlog({ ...formBlog, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider select-none">Publish Immediately</span>
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-650 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Post</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Blog Posts Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">Create educational content and updates to engage your customers.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-left">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Post</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {blogs.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {b.image ? (
                              <img src={b.image} alt={b.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                <FileText className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-sm text-slate-800 line-clamp-1">{b.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">By {b.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(b.publishedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${b.isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {b.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(b)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
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
