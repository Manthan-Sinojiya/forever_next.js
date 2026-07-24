import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPageBySlug } from "@/actions/customPages";
import { notFound } from "next/navigation";

export default async function ShippingPolicy() {
  const page = await getPageBySlug("shipping-policy");

  if (!page) {
    return notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-slate-50 min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">{page.title}</h1>
            <div 
              className="prose prose-emerald max-w-none text-slate-600"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
