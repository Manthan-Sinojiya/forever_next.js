"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, MapPin, Loader2, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, city, state }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSuccess(true);
      // Clean up fields
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setCity("");
      setState("");

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
    <form onSubmit={handleSubmit} className="space-y-4">
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
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm font-medium"
            placeholder="John Doe"
          />
        </div>
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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm font-medium"
            placeholder="name@example.com"
          />
        </div>
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
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm font-medium"
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
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
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

