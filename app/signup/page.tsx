import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Forever Healthcare account to purchase wellness products, manage your profile, and track orders.",
};

export default function SignupPage() {
  return (
    <main className="flex-1 w-full bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] flex items-center justify-center min-h-screen py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-medical/5 rounded-full blur-3xl -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -mr-32 -mb-32" />
      <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.015]" />

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-xl border border-white/60">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-medical to-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-medical/20">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground mb-2">Create Account</h1>
            <p className="text-muted text-sm">Join Forever Healthcare for exclusive wellness products.</p>
          </div>
          
          <SignupForm />

          <div className="mt-6 text-center text-sm text-muted border-t border-slate-100 pt-4">
            Already have an account? <Link href="/login" className="text-primary hover:text-medical font-semibold transition-colors">Log in</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
