import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-slate-50 min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
            <div className="prose prose-emerald max-w-none text-slate-600">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h3>1. Information We Collect</h3>
              <p>We collect information that you provide directly to us when making a purchase or creating an account, including your name, email address, shipping address, and payment information.</p>
              
              <h3>2. How We Use Your Information</h3>
              <p>We use the information we collect to process your orders, communicate with you about your orders, and improve our services.</p>
              
              <h3>3. Information Sharing</h3>
              <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except trusted third parties who assist us in operating our website, conducting our business, or servicing you.</p>

              <h3>4. Data Security</h3>
              <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
