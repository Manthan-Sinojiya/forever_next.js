"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { deleteMedia } from "@/actions/admin/media";
import { Trash2, UploadCloud, Copy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MediaClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        
        // Wait, the /api/upload route doesn't save to the Media DB model right now!
        // So we just rely on /api/upload and then we need to insert it to DB here.
        const uploadData = await res.json();
        
        // Let's create an entry in the DB via another route or server action
        await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: uploadData.url,
            publicId: uploadData.url, // For local, the URL is the publicId
            format: file.type,
            bytes: file.size,
          })
        });
      }
      toast.success("Upload successful");
      router.refresh(); // In Next 13+, better to use router.refresh() to reload server data
      // For immediate client update we would fetch the data again
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, publicId: string) => {
    if (!confirm("Delete this media?")) return;
    const res = await deleteMedia(id, publicId);
    if (res.success) {
      setData((prev) => prev.filter((m) => m._id !== id));
      toast.success("Media deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 font-medium">
              {isUploading ? "Uploading..." : "Click to upload files"}
            </p>
          </div>
          <input type="file" className="hidden" multiple accept="image/*" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.map((item) => (
          <div key={item._id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative bg-gray-100">
              <Image src={item.url} alt="Media" fill className="object-contain" sizes="200px" />
            </div>
            <div className="p-2 flex items-center justify-between bg-white">
              <button onClick={() => copyUrl(item.url)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Copy URL">
                <Copy size={16} />
              </button>
              <button onClick={() => handleDelete(item._id, item.publicId)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="col-span-full text-center text-gray-500 py-8">No media found.</p>}
      </div>
    </div>
  );
}
