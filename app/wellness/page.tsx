import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle2, Activity, Heart, Shield, Sparkles, Target, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Wellness Program",
  description: "Join the Forever Healthcare Wellness Program. A comprehensive, personalized approach combining ancient Ayurvedic wisdom with modern medical science.",
};

export default function WellnessProgramPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-6 lg:pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-primary text-sm font-semibold mb-5">
              <Activity className="w-4 h-4 text-medical" />
              Holistic Healthcare
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-4 leading-tight">
              The Forever Healthcare <br className="hidden md:block" />
              <span className="gradient-text">Wellness Program</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              A comprehensive, personalized approach combining ancient Ayurvedic wisdom with modern medical science to optimize your daily health.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="pb-12 lg:pb-16 pt-6 lg:pt-8 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm card-hover text-center group">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading text-foreground">Personalized Care</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Tailored health plans designed specifically for your body type and medical history.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm card-hover text-center group">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading text-foreground">Immunity Boosting</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Natural supplements and routines focused on strengthening your body&apos;s natural defenses.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm card-hover text-center group">
                <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading text-foreground">Active Monitoring</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Continuous tracking of your vitals using our export-standard healthcare equipment.
                </p>
              </div>
            </div>

            {/* Detailed Content */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Abstract Illustration instead of placeholder image */}
              <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary/10 to-medical/10 p-10 lg:p-14 aspect-square flex items-center justify-center">
                {/* Background decorative shapes */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-medical/10 rounded-full blur-2xl -ml-16 -mb-16" />
                
                {/* Central abstract element */}
                <div className="relative z-10 w-full max-w-sm">
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60 relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-medical rounded-2xl flex items-center justify-center mb-6 shadow-md text-white">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-2 bg-light-gray rounded-full w-3/4" />
                      <div className="h-2 bg-light-gray rounded-full w-full" />
                      <div className="h-2 bg-light-gray rounded-full w-5/6" />
                      <div className="h-2 bg-light-gray rounded-full w-4/6" />
                    </div>
                    
                    {/* Floating elements */}
                    <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 animate-float">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">Vitals</div>
                        <div className="text-[10px] text-muted">Optimized</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content side */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-primary/10 text-primary text-xs font-semibold mb-6">
                  Membership Benefits
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-foreground">
                  Why Join Our <span className="gradient-text">Program?</span>
                </h2>
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4">
                    <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-medical/10 flex items-center justify-center text-medical">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-1 text-foreground">Expert Ayurvedic Doctors</h4>
                      <p className="text-muted text-sm leading-relaxed">Get 1-on-1 consultations with verified practitioners with over 15 years of experience.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-medical/10 flex items-center justify-center text-medical">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-1 text-foreground">Discounts on Supplements</h4>
                      <p className="text-muted text-sm leading-relaxed">Members receive a flat 20% discount on all our in-house medical products and equipment.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-medical/10 flex items-center justify-center text-medical">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-1 text-foreground">Monthly Progress Reports</h4>
                      <p className="text-muted text-sm leading-relaxed">Track your improvements over time with detailed health analytics sent directly to your dashboard.</p>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact" className="btn-primary inline-flex items-center gap-2 text-sm">
                  Join the Program Today
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
