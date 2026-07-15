"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Plus, Trash2, X, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Slide {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  order: number;
}

const emptyForm = {
  title: "",
  subtitle: "",
  imageUrl: "",
  buttonText: "Shop Now",
  buttonLink: "/products",
  order: 0,
};

export default function AdminBannersPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSlide, setNewSlide] = useState(emptyForm);

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/hero-slides");
      const data = await res.json();
      if (data.success) {
        setSlides(data.data);
      }
    } catch (err) {
      console.error("Failed to load slides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) return;
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSlides(slides.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error("Error deleting slide:", err);
    }
  };

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlide),
      });
      const data = await res.json();
      if (data.success) {
        setSlides([...slides, data.data].sort((a, b) => a.order - b.order));
        setIsAdding(false);
        setNewSlide(emptyForm);
      }
    } catch (err) {
      console.error("Error creating slide:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar active="Hero Banners" />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-slate-800">Hero Slider CMS</h1>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              isAdding
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            }`}
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Cancel" : "Add Slide"}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {/* Add slide form */}
          {isAdding && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold font-heading text-slate-800 mb-5 pb-4 border-b border-slate-100">
                Create New Slider Banner
              </h2>
              <form onSubmit={handleAddSlide} className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Slide Title *</label>
                  <input
                    required
                    value={newSlide.title}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="e.g. 100% Organic Ayurvedic Health Solutions"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Subtitle / Promotion Text *</label>
                  <input
                    required
                    value={newSlide.subtitle}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="e.g. Authentic Herbs Direct from Himalayan Valleys"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Image URL *</label>
                  <input
                    required
                    value={newSlide.imageUrl}
                    onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                    type="url"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Button Text</label>
                    <input
                      value={newSlide.buttonText}
                      onChange={(e) => setNewSlide({ ...newSlide, buttonText: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Sort Order</label>
                    <input
                      value={newSlide.order}
                      onChange={(e) => setNewSlide({ ...newSlide, order: parseInt(e.target.value) || 0 })}
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 shadow-sm"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAdding(false); setNewSlide(emptyForm); }}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Slides List Grid */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-5 pb-4 border-b border-slate-100">Active Slider Banners ({slides.length})</h3>
            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Loading slides...</p>
              </div>
            ) : slides.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <ImageIcon className="w-12 h-12 text-slate-350 mx-auto mb-3" />
                <p className="font-bold text-sm">No slider banners in DB</p>
                <p className="text-xs mt-1">Add a slide using the button above.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {slides.map((slide) => (
                  <div key={slide._id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col bg-slate-50/50 hover:shadow-md transition-shadow relative">
                    <div className="relative h-44 w-full bg-slate-100">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end text-white">
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-[10px] w-6 h-6 rounded-full flex items-center justify-center">
                          #{slide.order}
                        </span>
                        <h4 className="font-bold text-sm line-clamp-1">{slide.title}</h4>
                        <p className="text-xs text-white/80 line-clamp-2 mt-1">{slide.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center bg-white border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-400">Btn Link: {slide.buttonLink}</span>
                      <button
                        onClick={() => handleDelete(slide._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-50 hover:border-red-100"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
