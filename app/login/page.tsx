"use client";

import Link from "next/link";
import { Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="flex-1 w-full bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] flex items-center justify-center min-h-screen py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-medical/5 rounded-full blur-3xl -ml-32 -mb-32" />
      <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.015]" />

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-xl border border-white/60">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-medical rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted text-sm">
              Sign in to manage your profile and orders.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-light-gray border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-light-gray border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  href="#"
                  className="text-xs text-primary hover:text-medical font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 py-3"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:text-medical font-semibold transition-colors"
            >
              Sign up
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-sm">Loading login portal...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
