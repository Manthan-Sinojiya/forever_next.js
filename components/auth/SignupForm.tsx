"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, MapPin, Loader2, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      city: "",
      state: "",
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (!res.ok || !responseData.success) {
        throw new Error(responseData.error || "Something went wrong. Please try again.");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-3.5 rounded-2xl flex items-center gap-2.5 animate-pulse-slow">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium p-3.5 rounded-2xl flex items-center gap-2.5 animate-pulse-slow">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Account created successfully! Redirecting to login...</span>
        </div>
      )}

      {/* Full Name */}
      <div className="group">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 transition-colors duration-200 group-focus-within:text-primary">
          Full Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-primary">
            <User className="h-4.5 w-4.5" />
          </div>
          <input
            {...register("name")}
            className={`w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50/70 border ${errors.name ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200/80 focus:border-primary focus:ring-4 focus:ring-primary/10'} focus:bg-white outline-none transition-all duration-300 text-sm font-medium`}
            placeholder="John Doe"
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Email Address */}
      <div className="group">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 transition-colors duration-200 group-focus-within:text-primary">
          Email Address *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-primary">
            <Mail className="h-4.5 w-4.5" />
          </div>
          <input
            type="email"
            {...register("email")}
            className={`w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50/70 border ${errors.email ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200/80 focus:border-primary focus:ring-4 focus:ring-primary/10'} focus:bg-white outline-none transition-all duration-300 text-sm font-medium`}
            placeholder="name@example.com"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password and Phone side-by-side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Password */}
        <div className="group">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 transition-colors duration-200 group-focus-within:text-primary">
            Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-primary">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full pl-11 pr-11 py-2.5 rounded-2xl bg-slate-50/70 border ${errors.password ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200/80 focus:border-primary focus:ring-4 focus:ring-primary/10'} focus:bg-white outline-none transition-all duration-300 text-sm font-medium`}
              placeholder="••••••••"
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
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Phone Number */}
        <div className="group">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 transition-colors duration-200 group-focus-within:text-primary">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-primary">
              <Phone className="h-4.5 w-4.5" />
            </div>
            <input
              {...register("phone")}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm font-medium"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>
      </div>

      {/* City and State side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div className="group">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 transition-colors duration-200 group-focus-within:text-primary">
            City
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-primary">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <input
              {...register("city")}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm font-medium"
              placeholder="Mumbai"
            />
          </div>
        </div>

        {/* State */}
        <div className="group">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 transition-colors duration-200 group-focus-within:text-primary">
            State
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-primary">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <input
              {...register("state")}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm font-medium"
              placeholder="Maharashtra"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer mt-5 py-3.5 rounded-full relative group overflow-hidden"
      >
        {loading ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
