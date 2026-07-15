"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, PackageSearch, X, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  todayDeal: boolean;
  description: string;
}

interface ProductForm {
  _id?: string;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  todayDeal: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  category: "",
  price: "",
  originalPrice: "",
  imageUrl: "",
  description: "Premium healthcare product.",
  inStock: true,
  featured: false,
  todayDeal: false,
};

const predefinedCategories = [
  "Food Supplements",
  "Healthcare Equipments",
  "Men Health",
  "Personal Care",
  "Ayurvedic Juices",
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);
  const [formProduct, setFormProduct] = useState<ProductForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>(predefinedCategories);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?all=true");
      const data = await response.json();
      if (data.success) setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
      setCategories(Array.from(new Set([...predefinedCategories, ...uniqueCats])));
    }
  }, [products]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEditClick = (p: Product) => {
    setFormProduct({
      _id: p._id,
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : "",
      imageUrl: p.imageUrl,
      description: p.description || "Premium healthcare product.",
      inStock: p.inStock,
      featured: p.featured || false,
      todayDeal: p.todayDeal || false,
    });
    setFormMode("edit");
    setIsAdding(true);
  };

  const handleStartAdd = () => {
    setFormProduct(emptyForm);
    setFormMode("add");
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setFormProduct(emptyForm);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formProduct.name,
        category: formProduct.category,
        price: parseFloat(formProduct.price),
        originalPrice: formProduct.originalPrice ? parseFloat(formProduct.originalPrice) : undefined,
        imageUrl: formProduct.imageUrl,
        description: formProduct.description,
        inStock: formProduct.inStock,
        featured: formProduct.featured,
        todayDeal: formProduct.todayDeal,
      };

      if (formMode === "add") {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            rating: 5,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setProducts([data.data, ...products]);
          setIsAdding(false);
          setFormProduct(emptyForm);
        }
      } else {
        const res = await fetch(`/api/products/${formProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts(products.map((p) => (p._id === formProduct._id ? data.data : p)));
          setIsAdding(false);
          setFormProduct(emptyForm);
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar active="Products" />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-foreground">Product Management</h1>
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
            {isAdding ? "Cancel" : "Add Product"}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {/* Form */}
          {isAdding && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold font-heading text-slate-800 mb-5 pb-4 border-b border-slate-100">
                {formMode === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <form onSubmit={handleSubmitProduct} className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Product Name *</label>
                  <input
                    required
                    value={formProduct.name}
                    onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="e.g. Ashwagandha 500mg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category * (Type custom or select)</label>
                  <input
                    list="category-suggestions"
                    required
                    value={formProduct.category}
                    onChange={(e) => setFormProduct({ ...formProduct, category: e.target.value })}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="e.g. Food Supplements"
                  />
                  <datalist id="category-suggestions">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Price (₹) *</label>
                  <input
                    required
                    value={formProduct.price}
                    onChange={(e) => setFormProduct({ ...formProduct, price: e.target.value })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="e.g. 1299"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Original Price (₹) (Optional - for discount display)</label>
                  <input
                    value={formProduct.originalPrice}
                    onChange={(e) => setFormProduct({ ...formProduct, originalPrice: e.target.value })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="e.g. 1999"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Image URL *</label>
                  <input
                    required
                    value={formProduct.imageUrl}
                    onChange={(e) => setFormProduct({ ...formProduct, imageUrl: e.target.value })}
                    type="url"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description *</label>
                  <textarea
                    required
                    value={formProduct.description}
                    onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium resize-none"
                    placeholder="Provide details about the product..."
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-3 gap-4 py-2">
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl transition-all border border-slate-100">
                    <input
                      type="checkbox"
                      checked={formProduct.inStock}
                      onChange={(e) => setFormProduct({ ...formProduct, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider select-none">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl transition-all border border-slate-100">
                    <input
                      type="checkbox"
                      checked={formProduct.featured}
                      onChange={(e) => setFormProduct({ ...formProduct, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider select-none">Featured</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl transition-all border border-slate-100">
                    <input
                      type="checkbox"
                      checked={formProduct.todayDeal}
                      onChange={(e) => setFormProduct({ ...formProduct, todayDeal: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider select-none">Today's Deal</span>
                  </label>
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 shadow-sm cursor-pointer"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Save Product"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="relative max-w-xs w-full">
              <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 w-full outline-none text-sm focus:border-emerald-600/30 transition-colors"
              />
            </div>
            <span className="text-sm text-slate-400 font-semibold whitespace-nowrap">{filtered.length} products</span>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-650 text-emerald-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Product</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Category</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Price</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Status</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((product) => (
                      <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block leading-snug">{product.name}</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.featured && (
                                  <span className="text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">
                                    Featured
                                  </span>
                                )}
                                {product.todayDeal && (
                                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">
                                    Today's Deal
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 font-semibold">{product.category}</td>
                        <td className="px-5 py-3.5 font-black text-emerald-600">
                          ₹{product.price.toFixed(2)}
                          {product.originalPrice && (
                            <span className="text-xs line-through text-slate-400 block font-normal mt-0.5">
                              ₹{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              product.inStock
                                ? "bg-emerald-55 bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-red-50 text-red-750 border border-red-100"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="w-8 h-8 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-16 text-center text-muted">
                          <PackageSearch className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                          <p className="font-medium">No products found.</p>
                          <p className="text-xs mt-1">Try adjusting your search or add a new product above.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
