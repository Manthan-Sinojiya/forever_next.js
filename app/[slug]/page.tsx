import dbConnect from "@/lib/mongodb";
import { CustomPage } from "@/models/CustomPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  const page = await CustomPage.findOne({ slug, status: "published" });
  
  if (!page) return { title: "Page Not Found - Forever Healthcare" };

  return {
    title: page.seoTitle || `${page.title} - Forever Healthcare`,
    description: page.seoDescription || "",
    keywords: page.seoKeywords || "",
  };
}

export default async function DynamicCustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  const page = await CustomPage.findOne({ slug, status: "published" });
  
  if (!page) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      <main className="flex-1 w-full min-h-screen bg-white pb-20">
        
        {/* Top Banner */}
        {page.bannerImage && (
          <div className="w-full relative h-[30vh] sm:h-[40vh] bg-slate-100">
            <Image 
              src={page.bannerImage} 
              alt={page.title} 
              fill 
              className="object-cover" 
              priority 
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!page.bannerImage && (
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-800 mb-8 border-b border-slate-100 pb-4">
              {page.title}
            </h1>
          )}

          <div 
            className="prose prose-emerald max-w-none text-slate-700 w-full"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

      </main>
      
      <Footer />
    </>
  );
}
