import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, User } from "lucide-react";
import connectDB from "@/lib/mongodb";
import { Blog as BlogModel } from "@/models/Blog";

export default async function BlogListingPage() {
  await connectDB();
  const blogs = await BlogModel.find({ status: "published" }).sort({ createdAt: -1 }).lean();
  
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-slate-50 min-h-screen pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-800 mb-4">Health & Wellness Blog</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Expert insights, health tips, and Ayurvedic wisdom to help you live a healthier life.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length === 0 ? (
              <div className="text-center col-span-full py-10">No blog posts found.</div>
            ) : blogs.map((post: any) => (
              <div key={post._id.toString()} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative w-full h-56 overflow-hidden">
                  <Image src={post.featuredImage || "/placeholder.jpg"} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {post.tags && post.tags.length > 0 && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-emerald-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                      {post.tags[0]}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    {post.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {post.author}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-xl font-heading text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1" dangerouslySetInnerHTML={{ __html: post.excerpt || (post.content.substring(0, 150) + "...") }} />
                  <Link href={`/blog/${post.slug || post._id.toString()}`} className="text-emerald-600 font-bold text-sm flex items-center gap-2 group/link w-max mt-auto">
                    Read Full Article <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
