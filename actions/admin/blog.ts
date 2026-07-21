"use server";

import { revalidatePath } from "next/cache";
import { Blog } from "@/models/Blog";
import connectDB from "@/lib/mongodb";

export async function getBlogs(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(blogs));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { success: false, error: "Failed to fetch blogs" };
  }
}

export async function getBlogById(id: string) {
  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog) return { success: false, error: "Blog post not found" };

    const b = JSON.parse(JSON.stringify(blog));

    return { success: true, data: b };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { success: false, error: "Failed to fetch blog post" };
  }
}

export async function createBlog(data: any) {
  try {
    await connectDB();
    const newBlog = new Blog(data);
    await newBlog.save();
    revalidatePath("/admin/blog");
    return { success: true, data: newBlog._id.toString() };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { success: false, error: "Failed to create blog post" };
  }
}

export async function updateBlog(id: string, data: any) {
  try {
    await connectDB();
    const updated = await Blog.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/blog");
    return { success: true, data: updated?._id.toString() };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { success: false, error: "Failed to update blog post" };
  }
}

export async function deleteBlog(id: string) {
  try {
    await connectDB();
    await Blog.findByIdAndDelete(id);
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}
