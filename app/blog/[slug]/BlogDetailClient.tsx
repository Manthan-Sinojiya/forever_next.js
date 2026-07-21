"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function BlogDetailClient({
  article,
  companionProducts
}: {
  article: any;
  companionProducts: any[];
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-16">
      {/* Article Header Banner */}
      <div className="relative w-full h-[50vh] min-h-[350px] bg-slate-900 overflow-hidden">
        <Image
          src={article.image || "/placeholder.jpg"}
          alt={article.title}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          {/* Category tag */}
          {article.tags && article.tags.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-sm">
              {article.tags[0]}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading leading-tight tracking-tight max-w-4xl">
            {article.title}
          </h1>
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 mt-5 text-slate-200 text-sm font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              {article.author}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Body Column */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm leading-relaxed text-slate-700">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-wider mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Articles
            </Link>

            {/* Dynamic Content */}
            <div 
              className="prose prose-emerald max-w-none text-slate-600 space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Author box */}
            <div className="mt-10 p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold shrink-0">
                {article.author.split(" ").map((w: string) => w[0]).join("")}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-snug">{article.author}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Author</p>
              </div>
            </div>
          </article>

          {/* Right Companion Products Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Recommended box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold font-heading text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Recommended Products
              </h3>
              
              {companionProducts.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium italic">No recommendations found.</p>
              ) : (
                <div className="grid gap-4">
                  {companionProducts.map((prod) => (
                    <div key={prod._id} className="group/item flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-200">
                        <Image
                          src={prod.imageUrl}
                          alt={prod.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate leading-snug group-hover/item:text-emerald-700 transition-colors">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{prod.category}</span>
                        <span className="text-xs font-black text-emerald-600 block mt-1">₹{prod.price.toFixed(2)}</span>
                      </div>
                      <Link
                        href={`/products/${prod._id}`}
                        className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                        title="View Product"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href="/products"
                className="mt-5 w-full py-2.5 rounded-xl border border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold text-center block transition-all"
              >
                Browse Shop
              </Link>
            </div>

            {/* Newsletter Box */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-10 -mt-10" />
              
              {subscribed ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-450 text-emerald-450 text-emerald-400 flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm">Thank You for Subscribing!</h4>
                  <p className="text-[11px] text-slate-300">You will receive clinical tips and coupon alerts in your inbox shortly.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-base font-bold font-heading mb-2">Subscribe to Health Alerts</h3>
                  <p className="text-slate-330 text-slate-300 text-xs leading-relaxed mb-4">
                    Get the latest evidence-based wellness insights and discount codes directly in your inbox.
                  </p>
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 outline-none text-xs font-medium text-white placeholder-slate-400 focus:bg-white/20 focus:border-white/40 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                </>
              )}
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
