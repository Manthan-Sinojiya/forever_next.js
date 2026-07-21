"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Save, Upload, MessageSquare, Loader2 } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  type: "text" | "video";
  thumbnail?: string;
  videoUrl?: string;
  isActive: boolean;
}

interface TestimonialForm {
  _id?: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  type: "text" | "video";
  thumbnail?: string;
  videoUrl?: string;
  isActive: boolean;
}

const emptyForm: TestimonialForm = {
  name: "",
  location: "",
  rating: 5,
  text: "",
  type: "text",
  thumbnail: "",
  videoUrl: "",
  isActive: true,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);
  const [formTestimonial, setFormTestimonial] = useState<TestimonialForm>(emptyForm);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();
      if (data.success) setTestimonials(data.data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) setTestimonials(testimonials.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEditClick = (c: Testimonial) => {
    setFormTestimonial({
      _id: c._id,
      name: c.name,
      location: c.location,
      rating: c.rating,
      text: c.text,
      type: c.type,
      thumbnail: c.thumbnail || "",
      videoUrl: c.videoUrl || "",
      isActive: c.isActive,
    });
    setFormMode("edit");
    setIsAdding(true);
  };

  const handleStartAdd = () => {
    setFormTestimonial(emptyForm);
    setFormMode("add");
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setFormTestimonial(emptyForm);
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
          setFormTestimonial({ ...formTestimonial, thumbnail: data.url });
        } else {
          alert("Upload failed: " + data.error);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formTestimonial.name,
        location: formTestimonial.location,
        rating: formTestimonial.rating,
        text: formTestimonial.text,
        type: formTestimonial.type,
        thumbnail: formTestimonial.thumbnail,
        videoUrl: formTestimonial.videoUrl,
        isActive: formTestimonial.isActive,
      };

      if (formMode === "add") {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setTestimonials([...testimonials, data.data]);
          setIsAdding(false);
          setFormTestimonial(emptyForm);
        } else {
          alert(data.error);
        }
      } else {
        const res = await fetch(`/api/testimonials/${formTestimonial._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setTestimonials(testimonials.map((c) => (c._id === formTestimonial._id ? data.data : c)));
          setIsAdding(false);
          setFormTestimonial(emptyForm);
        } else {
          alert(data.error);
        }
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-foreground">Testimonial Management</h1>
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
            {isAdding ? "Cancel" : "Add Testimonial"}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {isAdding && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold font-heading text-slate-800 mb-5 pb-4 border-b border-slate-100">
                {formMode === "add" ? "Add New Testimonial" : "Edit Testimonial"}
              </h2>
              <form onSubmit={handleSubmitTestimonial} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Name *</label>
                    <input
                      required
                      value={formTestimonial.name}
                      onChange={(e) => setFormTestimonial({ ...formTestimonial, name: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Location *</label>
                    <input
                      value={formTestimonial.location}
                      required
                      onChange={(e) => setFormTestimonial({ ...formTestimonial, location: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. New York, USA"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Rating (1-5) *</label>
                    <input
                      required
                      min={1}
                      max={5}
                      value={formTestimonial.rating}
                      onChange={(e) => setFormTestimonial({ ...formTestimonial, rating: Number(e.target.value) })}
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Type *</label>
                    <select
                      value={formTestimonial.type}
                      onChange={(e) => setFormTestimonial({ ...formTestimonial, type: e.target.value as "text" | "video" })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    >
                      <option value="text">Text</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Testimonial Text *</label>
                  <textarea
                    required
                    value={formTestimonial.text}
                    onChange={(e) => setFormTestimonial({ ...formTestimonial, text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium resize-none"
                    placeholder="Enter the testimonial..."
                  />
                </div>

                {formTestimonial.type === "video" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Video URL</label>
                    <input
                      value={formTestimonial.videoUrl}
                      onChange={(e) => setFormTestimonial({ ...formTestimonial, videoUrl: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Thumbnail Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {formTestimonial.thumbnail && (
                      <div className="w-16 h-16 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                        <img src={formTestimonial.thumbnail} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 max-w-sm px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors text-sm font-medium text-slate-700">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>{formTestimonial.thumbnail ? "Change Image" : "Upload Image"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl transition-all border border-slate-100 w-max">
                    <input
                      type="checkbox"
                      checked={formTestimonial.isActive}
                      onChange={(e) => setFormTestimonial({ ...formTestimonial, isActive: e.target.checked })}
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
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Testimonial</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Testimonials Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">Create testimonials to display on the homepage.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-left">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Type / Rating</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {testimonials.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {c.thumbnail && (
                              <img src={c.thumbnail} alt={c.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                            )}
                            <div>
                              <p className="font-bold text-sm text-slate-800">{c.name}</p>
                              <p className="text-xs text-slate-500">{c.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{c.type} - {c.rating}⭐</span>
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
