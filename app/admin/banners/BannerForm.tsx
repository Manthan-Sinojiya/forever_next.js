"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBanner, updateBanner, getBannerOptions } from "@/actions/admin/banners";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  position: z.enum([
    "about-us",
    "categories-overview",
    "category-specific",
    "products-overview",
    "product-specific",
    "homepage-top",
    "homepage-mid",
    "Homepage",
    "Category",
    "Product"
  ]),
  targetCategory: z.string().optional(),
  targetProduct: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
  priority: z.number().min(0).optional(),
  
  image: z.string().min(1, "Desktop image is required"),
  tabletImage: z.string().optional(),
  mobileImage: z.string().optional(),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function BannerForm({ initialData, isEditing = false }: BannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string; slug?: string }[]>([]);
  const [products, setProducts] = useState<{ _id: string; name: string; slug?: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    async function loadOptions() {
      const res = await getBannerOptions();
      if (res.success) {
        setCategories(res.categories || []);
        setProducts(res.products || []);
      }
      setLoadingOptions(false);
    }
    loadOptions();
  }, []);

  // Normalize initial values
  const defaultPosition = initialData?.position || "about-us";
  const defaultStatus = initialData?.isActive === false ? "Inactive" : "Active";

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      buttonText: initialData?.buttonText || "",
      buttonUrl: initialData?.link || initialData?.buttonUrl || "",
      position: defaultPosition,
      targetCategory: initialData?.targetCategory || "",
      targetProduct: initialData?.targetProduct || "",
      status: defaultStatus,
      priority: initialData?.priority ?? 0,
      image: initialData?.image || "",
      tabletImage: initialData?.tabletImage || "",
      mobileImage: initialData?.mobileImage || "",
    }
  });

  const selectedPosition = watch("position");

  const onSubmit = async (data: BannerFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image,
        tabletImage: data.tabletImage,
        mobileImage: data.mobileImage,
        link: data.buttonUrl,
        buttonText: data.buttonText,
        position: data.position,
        targetCategory: data.position === "category-specific" ? data.targetCategory : undefined,
        targetProduct: data.position === "product-specific" ? data.targetProduct : undefined,
        isActive: data.status === "Active",
        priority: Number(data.priority) || 0,
      };

      let res;
      if (isEditing && initialData?._id) {
        res = await updateBanner(initialData._id, payload);
      } else {
        res = await createBanner(payload);
      }

      if (res.success) {
        router.push("/admin/banners");
        router.refresh();
      } else {
        setError(res.error || "Failed to save banner");
      }
    } catch {
      setError("An unexpected error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? "Edit Banner" : "Create New Banner"}
              </h1>
              <p className="text-sm text-slate-500">
                Upload and configure banners for About Us, Category, Category Wise, Product, & Product Wise pages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/banners")}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl shadow-sm hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {isEditing ? "Update Banner" : "Save Banner"}
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Banner Content & Placement Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Banner Text & Content
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Banner Title *
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Special Offer 20% Off or Pure Ayurvedic Care"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1 font-medium">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subtitle / Description
                  </label>
                  <input
                    {...register("subtitle")}
                    placeholder="e.g. Authentic herbal supplements tested for purity and potency"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Button Text
                    </label>
                    <input
                      {...register("buttonText")}
                      placeholder="e.g. Shop Now, Explore More"
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Button Link / URL
                    </label>
                    <input
                      {...register("buttonUrl")}
                      placeholder="e.g. /categories/ayurveda or /shop"
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Placement / Context Settings */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Placement & Location
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Banner Placement *
                  </label>
                  <select
                    {...register("position")}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="about-us">About Us Page Banner</option>
                    <option value="categories-overview">Categories Overview Banner</option>
                    <option value="category-specific">Category Wise (Specific Category Banner)</option>
                    <option value="products-overview">Products Overview / Shop Page Banner</option>
                    <option value="product-specific">Product Wise (Specific Product Banner)</option>
                    <option value="homepage-top">Homepage Top Banner</option>
                    <option value="homepage-mid">Homepage Middle Banner</option>
                  </select>
                </div>

                {/* Target Selection depending on position */}
                {selectedPosition === "category-specific" && (
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                    <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Select Target Category *
                    </label>
                    {loadingOptions ? (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 py-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading categories...
                      </div>
                    ) : (
                      <select
                        {...register("targetCategory")}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="">-- Choose Category --</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.slug || cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-[11px] text-emerald-700 font-medium">
                      This banner will be rendered when viewing this specific category page.
                    </p>
                  </div>
                )}

                {selectedPosition === "product-specific" && (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider">
                      Select Target Product *
                    </label>
                    {loadingOptions ? (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 py-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading products...
                      </div>
                    ) : (
                      <select
                        {...register("targetProduct")}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">-- Choose Product --</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-[11px] text-blue-700 font-medium">
                      This banner will be rendered when viewing this specific product details page.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Status *
                    </label>
                    <select
                      {...register("status")}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Priority
                    </label>
                    <input
                      type="number"
                      {...register("priority", { valueAsNumber: true })}
                      placeholder="0"
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media & Images Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 pb-1">Banner Media / Image Uploads</h3>
              <p className="text-xs text-slate-500">
                Upload responsive banner images for Desktop, Tablet, and Mobile displays.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Desktop Image Upload */}
              <div className="space-y-3 p-4 border border-slate-200 rounded-2xl bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Desktop Banner Image *
                </label>
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <ImageUpload
                      label="Upload Desktop Banner"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.image && (
                  <p className="text-red-500 text-xs font-medium">{errors.image.message}</p>
                )}
              </div>

              {/* Tablet Image Upload */}
              <div className="space-y-3 p-4 border border-slate-200 rounded-2xl bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Tablet Image (Optional)
                </label>
                <Controller
                  control={control}
                  name="tabletImage"
                  render={({ field }) => (
                    <ImageUpload
                      label="Upload Tablet Banner"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Mobile Image Upload */}
              <div className="space-y-3 p-4 border border-slate-200 rounded-2xl bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mobile Image (Optional)
                </label>
                <Controller
                  control={control}
                  name="mobileImage"
                  render={({ field }) => (
                    <ImageUpload
                      label="Upload Mobile Banner"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
