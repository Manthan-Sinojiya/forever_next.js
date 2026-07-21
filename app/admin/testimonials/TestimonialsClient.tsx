"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteTestimonial, toggleTestimonialApproval, createTestimonial } from "@/actions/admin/testimonials";
import { X, Star, User, Video, PlayCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageUpload } from "@/components/admin/ImageUpload";

const schema = z.object({
  customerName: z.string().min(1, "Customer Name is required"),
  customerImage: z.string().optional(),
  designation: z.string().optional(),
  company: z.string().optional(),
  review: z.string().min(1, "Review Content is required"),
  rating: z.coerce.number().min(1).max(5).optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  sortOrder: z.coerce.number().default(0),
  videoType: z.enum(["none", "upload", "youtube", "vimeo"]).default("none"),
  videoUrl: z.string().optional(),
  videoThumbnail: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function TestimonialsClient({ initialData, totalPages }: any) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5, isFeatured: false, status: "active", sortOrder: 0, videoType: "none" }
  });
  
  const handleToggleApproval = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "draft" : "active";
    await toggleTestimonialApproval(id, newStatus);
    router.refresh();
  };

  const columns = [
    { 
      key: "customer", 
      label: "Customer",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          {row.customerImage ? (
            <img src={row.customerImage} alt={row.customerName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
              {row.customerName ? row.customerName.charAt(0) : <User className="w-5 h-5" />}
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-900">{row.customerName}</div>
            <div className="text-xs text-slate-500 font-medium">
              {row.designation}{row.company ? ` @ ${row.company}` : ''}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: "rating", 
      label: "Rating",
      render: (row: any) => (
        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 w-fit px-2 py-1 rounded-md">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="font-bold text-sm">{row.rating}</span>
        </div>
      )
    },
    {
      key: "content",
      label: "Content",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {row.videoType && row.videoType !== "none" && (
            <div className="flex-shrink-0 w-8 h-8 rounded bg-rose-50 text-rose-500 flex items-center justify-center" title="Video Testimonial">
              <PlayCircle className="w-4 h-4" />
            </div>
          )}
          <div className="max-w-[200px] truncate text-sm text-slate-600 font-medium" title={row.review}>
            {row.review}
          </div>
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => {
        const isActive = row.status === "active";
        return (
          <button
            onClick={() => handleToggleApproval(row._id || row.id, row.status)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:shadow-sm ${
              isActive 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            {isActive ? "Active" : "Draft"}
          </button>
        );
      }
    },
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      await deleteTestimonial(id);
      router.refresh();
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        videoType: data.videoType === "none" ? undefined : data.videoType
      };
      await createTestimonial(payload);
      setIsModalOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save Testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const videoTypeVal = watch("videoType");
  const customerImageVal = watch("customerImage");
  const videoThumbnailVal = watch("videoThumbnail");
  const videoUrlVal = watch("videoUrl");

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Testimonials</h1>
          <p className="text-slate-500 mt-1">Manage customer stories, videos, and social proof.</p>
        </div>
      </div>

      <DataTable
        title="Customer Reviews"
        columns={columns}
        data={initialData}
        pageCount={totalPages}
        onAdd={() => setIsModalOpen(true)}
        onDelete={handleDelete}
        searchPlaceholder="Search testimonials..."
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-100 my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Add Testimonial</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form id="add-testimonial-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Customer Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Customer Name *</label>
                      <input 
                        {...register("customerName")}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                        placeholder="E.g. Sarah Johnson"
                      />
                      {errors.customerName && <p className="text-rose-500 text-xs mt-1.5">{errors.customerName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Customer Image</label>
                      <ImageUpload 
                        value={customerImageVal || ""} 
                        onChange={(url) => setValue("customerImage", url)} 
                        label="Profile Image" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
                      <input 
                        {...register("designation")}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                        placeholder="E.g. CEO"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label>
                      <input 
                        {...register("company")}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                        placeholder="E.g. TechCorp"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Review Content</h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rating (1-5)</label>
                      <div className="relative w-32">
                        <input 
                          type="number"
                          min="1" max="5"
                          {...register("rating")}
                          className="w-full border border-slate-200 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                        />
                        <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Testimonial Text *</label>
                      <textarea 
                        {...register("review")}
                        rows={4}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-y" 
                        placeholder="What did they say about us?"
                      />
                      {errors.review && <p className="text-rose-500 text-xs mt-1.5">{errors.review.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Video */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2"><Video className="w-4 h-4"/> Video Testimonial</h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Video Source</label>
                      <select 
                        {...register("videoType")}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                      >
                        <option value="none">None (Text Only)</option>
                        <option value="upload">Direct Upload (.mp4)</option>
                        <option value="youtube">YouTube URL</option>
                        <option value="vimeo">Vimeo URL</option>
                      </select>
                    </div>

                    {videoTypeVal !== "none" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Video URL</label>
                          <input 
                            {...register("videoUrl")}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                            placeholder={videoTypeVal === 'upload' ? 'https://res.cloudinary.com/.../video.mp4' : 'https://youtube.com/watch?v=...'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Video Thumbnail</label>
                          <ImageUpload 
                            value={videoThumbnailVal || ""} 
                            onChange={(url) => setValue("videoThumbnail", url)} 
                            label="Cover Image" 
                          />
                        </div>
                        {videoUrlVal && videoTypeVal === 'youtube' && (
                          <div>
                             <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preview</label>
                             <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center text-white/50">
                               Video Preview Here
                             </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Settings */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Settings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                      <select 
                        {...register("status")}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                      >
                        <option value="active">Active (Published)</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sort Order</label>
                      <input 
                        type="number"
                        {...register("sortOrder")}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer mt-6">
                        <input type="checkbox" {...register("isFeatured")} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm font-semibold text-slate-700">Featured</span>
                      </label>
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                form="add-testimonial-form"
                type="submit" 
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 transition-all"
              >
                {isSubmitting ? "Saving..." : "Save Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
