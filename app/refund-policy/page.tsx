import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPageBySlug } from "@/actions/customPages";

export default async function RefundPolicy() {
  const page = await getPageBySlug("refund-policy");

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
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Refund Policy</h1>
                <div className="prose prose-emerald max-w-none text-slate-600">
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  
                  <h3>1. Returns</h3>
                  <p>Our policy lasts 7 days. If 7 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
                  
                  <h3>2. Refunds</h3>
                  <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>
                  
                  <h3>3. Late or Missing Refunds</h3>
                  <p>If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. If you’ve done all of this and you still have not received your refund yet, please contact us.</p>
                  
                  <h3>4. Shipping</h3>
                  <p>To return your product, you should mail your product to our registered office address. You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
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
