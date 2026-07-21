import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1E5AA8]/20 to-[#43B97F]/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#1E5AA8] to-[#43B97F] flex items-center justify-center shadow-lg">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
        </div>
        <p className="text-slate-500 font-semibold text-sm animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
