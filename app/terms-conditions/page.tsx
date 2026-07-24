import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPageBySlug } from "@/actions/customPages";

export default async function TermsAndConditions() {
  const page = await getPageBySlug("terms-conditions");

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-slate-50 min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            {page ? (
              <>
                <h1 className="text-3xl font-bold text-slate-800 mb-6">{page.title}</h1>
                <div 
                  className="prose prose-emerald max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Terms & Conditions</h1>
                <div className="prose prose-emerald max-w-none text-slate-600">
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  
                  <h3>1. Acceptance of Terms</h3>
                  <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                  
                  <h3>2. Use License</h3>
                  <p>Permission is granted to temporarily download one copy of the materials (information or software) on Forever Healthcare's website for personal, non-commercial transitory viewing only.</p>
                  
                  <h3>3. Disclaimer</h3>
                  <p>The materials on Forever Healthcare's website are provided on an 'as is' basis. Forever Healthcare makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                  
                  <h3>4. Limitations</h3>
                  <p>In no event shall Forever Healthcare or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Forever Healthcare's website.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
