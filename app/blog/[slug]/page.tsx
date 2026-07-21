import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";
import Blog from "@/models/Blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import BlogDetailClient from "./BlogDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const article = await Blog.findOne({ slug });
  
  return {
    title: article ? `${article.seoTitle || article.title} - Forever Healthcare` : "Health Article - Forever Healthcare",
    description: article ? (article.seoDescription || "Certified healthcare articles and wellness tips.") : "Certified healthcare articles and wellness tips.",
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  const articleDoc = await Blog.findOne({ slug });
  
  if (!articleDoc) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <BookOpen className="w-12 h-12 text-slate-400 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 font-heading">Article Not Found</h1>
          <p className="text-slate-500 mt-1 max-w-sm">The article you are looking for might have been removed or relocated.</p>
          <Link href="/blog" className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const article = JSON.parse(JSON.stringify(articleDoc));

  // Load companion products from database based on first tag or generic
  let companionProducts: any[] = [];
  try {
    let query = {};
    if (article.tags && article.tags.length > 0) {
      // Try to find products that match the tag in category or title
      query = { 
        $or: [
          { category: new RegExp(article.tags[0], "i") },
          { name: new RegExp(article.tags[0], "i") }
        ] 
      };
    }
    const docs = await Product.find(query).limit(3);
    if (docs && docs.length > 0) {
      companionProducts = JSON.parse(JSON.stringify(docs));
    } else {
      // Fallback
      const fallbackDocs = await Product.find().limit(3);
      companionProducts = JSON.parse(JSON.stringify(fallbackDocs));
    }
  } catch (err) {
    console.error("Error loading blog products:", err);
  }

  return (
    <>
      <Navbar />
      <BlogDetailClient article={article} companionProducts={companionProducts} />
      <Footer />
    </>
  );
}
