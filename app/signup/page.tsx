import Link from "next/link";
import { Sparkles, HeartPulse, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign Up - Forever Healthcare",
  description: "Create your Forever Healthcare account to purchase wellness products, manage your profile, and track orders.",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      {/* Left Column: Brand Showcase Panel (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-[#1E5AA8] via-[#174A8A] to-[#43B97F] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Animated Background Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#5DD99A]/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04]" />

        {/* Top Branding Logo */}
        <div className="z-10 flex flex-col gap-6 items-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors duration-250 group/back"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-250 group-hover/back:-translate-x-1" />
            Back to Home
          </Link>
          <Link href="/" className="bg-white rounded-2xl py-2 px-4 shadow-md inline-block hover:opacity-90 transition-opacity">
            <Image
              src="/logo/logo.png"
              alt="Forever Healthcare Logo"
              width={160}
              height={46}
              className="h-8 md:h-9 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Middle Feature Highlights Cards */}
        <div className="my-auto space-y-6 z-10 max-w-md">
          <h2 className="text-3xl font-bold font-heading leading-tight mb-8">
            Start Your Journey Towards Vibrant Health and Vitality today.
          </h2>

          <div className="space-y-5">
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-[#5DD99A]/20 flex items-center justify-center flex-shrink-0">
                <HeartPulse className="w-5 h-5 text-[#5DD99A]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Personal Wellness Dashboard</h3>
                <p className="text-xs text-white/70 mt-1">Track orders, manage family prescriptions, and customize your herbal intake.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#5DD99A]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Exclusive Member Offers</h3>
                <p className="text-xs text-white/70 mt-1">Get priority stock alerts, wellness articles, and members-only pricing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-white/60 z-10">
          <p>© 2026 Forever Healthcare. Sourced naturally, formulated scientifically.</p>
        </div>
      </div>

      {/* Right Column: Dynamic Form Panel */}
      <div className="w-full lg:w-[58%] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC]">
        {/* Soft Background Blur Blobs */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-medical/5 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:32px_32px] opacity-[0.015]" />

        {/* Main Card Container */}
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/80 relative z-10 transition-all duration-500 hover:shadow-primary/5 animate-slide-up">


          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight">Create Account</h1>
            <p className="text-slate-555 text-sm mt-1.5">Join Forever Healthcare for premium wellness products.</p>
          </div>
          
          <SignupForm />

          <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-medical font-bold transition-colors duration-200">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

