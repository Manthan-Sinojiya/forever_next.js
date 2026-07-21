import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { Leaf, ShieldCheck } from "lucide-react";

export default async function DynamicSections() {
  await dbConnect();
  const settings = await Setting.find({
    key: { 
      $in: [
        "homepage_seo_text", 
        "homepage_custom_title", 
        "homepage_custom_content",
        "homepage_standards_title",
        "homepage_standards_content"
      ] 
    }
  });

  const getSetting = (key: string) => settings.find((s) => s.key === key)?.value || "";

  const seoText = getSetting("homepage_seo_text");
  const customTitle = getSetting("homepage_custom_title");
  const customContent = getSetting("homepage_custom_content");
  const standardsTitle = getSetting("homepage_standards_title");
  const standardsContent = getSetting("homepage_standards_content");

  return (
    <>
      {/* Uncompromising Standards Section */}
      {(standardsTitle || standardsContent) && (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {standardsTitle && (
              <div className="inline-flex items-center justify-center gap-2 mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <h2 className="text-3xl md:text-4xl font-black font-heading text-slate-800">{standardsTitle}</h2>
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
            )}
            {standardsContent && (
              <div 
                className="prose prose-emerald prose-lg mx-auto text-slate-600"
                dangerouslySetInnerHTML={{ __html: standardsContent }}
              />
            )}
          </div>
        </section>
      )}

      {/* Custom Section */}
      {(customTitle || customContent) && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {customTitle && (
              <div className="flex items-center gap-2 mb-8">
                <Leaf className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-slate-800">{customTitle}</h2>
              </div>
            )}
            {customContent && (
              <div 
                className="prose prose-emerald max-w-none text-slate-600 bg-emerald-50/30 p-8 rounded-3xl border border-emerald-100/50"
                dangerouslySetInnerHTML={{ __html: customContent }}
              />
            )}
          </div>
        </section>
      )}

      {/* SEO Text Section (Usually at the bottom of the page) */}
      {seoText && (
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="prose prose-sm prose-slate max-w-none text-slate-500"
              dangerouslySetInnerHTML={{ __html: seoText }}
            />
          </div>
        </section>
      )}
    </>
  );
}
