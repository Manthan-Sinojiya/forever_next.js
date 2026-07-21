"use client";

import Link from "next/link";
import { Lock, Mail, ShieldCheck, ArrowRight, ArrowLeft, Eye, EyeOff, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
      }

      // Sync user profile details to localStorage for backward-compatible navbar updates
      const profileRes = await fetch(`/api/profile?email=${encodeURIComponent(email)}`);
      const profileData = await profileRes.json();
      if (profileData.success && profileData.data) {
        localStorage.setItem("userRole", profileData.data.role);
        localStorage.setItem("userName", profileData.data.name);
        localStorage.setItem("userEmail", profileData.data.email);
      } else {
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userName", "User");
        localStorage.setItem("userEmail", email);
      }

      // Dispatch storage event to alert layout Navbar
      window.dispatchEvent(new Event("storage"));
      
      const role = localStorage.getItem("userRole");
      if (role === "admin") {
        router.push("/admin");
      } else if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLoginDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    // Keep local bypass for testing and demo purposes
    localStorage.setItem("userRole", "admin");
    localStorage.setItem("userName", "Admin Demo");
    localStorage.setItem("userEmail", "admin@foreverhealthcare.in");
    window.dispatchEvent(new Event("storage"));
    router.push("/admin");
  };

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
            Your Premium Destination for Ayurvedic & Wellness Solutions.
          </h2>

          <div className="space-y-5">
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-[#5DD99A]/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#5DD99A]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">100% Authentic Remedies</h3>
                <p className="text-xs text-white/70 mt-1">Sourced from vetted organic farmers and certified herbal laboratories.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#5DD99A]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Doctor Consultation Support</h3>
                <p className="text-xs text-white/70 mt-1">Direct integration with qualified wellness experts for customized plans.</p>
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
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/80 relative z-10 transition-all duration-500 hover:shadow-primary/5 animate-slide-up">


          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-555 text-sm mt-1.5">
              Sign in to manage your health portal and orders
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-3.5 rounded-2xl mb-5 flex items-center gap-2.5 animate-pulse-slow">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Field */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 transition-colors duration-200 group-focus-within:text-primary">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-primary">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider transition-colors duration-200 group-focus-within:text-primary">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:text-medical font-semibold transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-primary">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-65 py-3.5 mt-2 rounded-full relative group overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-5">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:text-medical font-bold transition-colors duration-200"
            >
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-semibold text-sm">Loading login portal...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

