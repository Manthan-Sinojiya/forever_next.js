import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const page = await Page.findOne({ slug, isActive: true });
  
  if (!page) return { title: "Page Not Found - Forever Healthcare" };

  return {
    title: page.metaTitle || `${page.title} - Forever Healthcare`,
    description: page.metaDescription || "Forever Healthcare",
  };
}

export default async function DynamicCMSPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  const page = await Page.findOne({ slug, isActive: true });
  
  if (!page) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      {page.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: page.customCSS }} />
      )}

      <main className="flex-1 w-full min-h-screen bg-white pb-20">
        
        {/* Top Banner */}
        {page.topBannerImage && (
          <div className="w-full relative h-[30vh] sm:h-[40vh] bg-slate-100">
            {page.topBannerLink ? (
              <Link href={page.topBannerLink} className="block w-full h-full relative group">
                <Image src={page.topBannerImage} alt={page.title} fill className="object-cover group-hover:opacity-95 transition-opacity" priority />
              </Link>
            ) : (
              <Image src={page.topBannerImage} alt={page.title} fill className="object-cover" priority />
            )}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!page.topBannerImage && (
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-800 mb-8 border-b border-slate-100 pb-4">
              {page.title}
            </h1>
          )}

          <div 
            className="prose prose-emerald max-w-none text-slate-700 w-full"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* Bottom Banner */}
        {page.bottomBannerImage && (
          <div className="w-full relative h-[25vh] sm:h-[35vh] bg-slate-100 mt-10">
            {page.bottomBannerLink ? (
              <Link href={page.bottomBannerLink} className="block w-full h-full relative group">
                <Image src={page.bottomBannerImage} alt={page.title} fill className="object-cover group-hover:opacity-95 transition-opacity" />
              </Link>
            ) : (
              <Image src={page.bottomBannerImage} alt={page.title} fill className="object-cover" />
            )}
          </div>
        )}

      </main>
      
      <Footer />
    </>
  );
}
