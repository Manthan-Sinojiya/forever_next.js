import React from "react";
import { getMedia } from "@/actions/admin/media";
import MediaClient from "./MediaClient";

export default async function MediaPage() {
  const mediaFiles = await getMedia();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
      </div>
      <MediaClient initialData={mediaFiles} />
    </div>
  );
}
