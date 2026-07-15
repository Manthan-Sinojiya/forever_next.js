"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    details: "Mon-Sat from 9am to 6pm",
    value: "+91 123 456 7890",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    details: "We'll respond within 24 hours",
    value: "info@foreverhealthcare.in",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Visit Us",
    details: "Our main headquarters",
    value: "Mumbai, Maharashtra, India",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Working Hours",
    details: "Monday - Saturday",
    value: "9:00 AM - 6:00 PM IST",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-6 lg:pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-primary text-sm font-semibold mb-5">
              <Send className="w-4 h-4 text-medical" />
              Get In Touch
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Have questions about our products or need medical advice? Our team is here to help.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="pb-12 lg:pb-16 pt-6 lg:pt-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm card-hover text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center mx-auto mb-4`}>
                    {info.icon}
                  </div>
                  <h3 className="font-bold text-lg font-heading text-foreground mb-1">{info.title}</h3>
                  <p className="text-xs text-muted mb-2">{info.details}</p>
                  <p className="font-semibold text-sm text-primary">{info.value}</p>
                </div>
              ))}
            </div>

            {/* Form + Map */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-2">
                  Send us a message
                </h2>
                <p className="text-muted text-sm mb-8">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>

                {success ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-800">Message Sent!</h3>
                    <p className="text-sm text-muted max-w-sm mx-auto">
                      Thank you for contacting Forever Healthcare. We have received your query, saved it to our records, and sent you a confirmation email receipt. Our team will respond shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn-primary text-xs font-bold inline-flex items-center gap-1.5 mt-2"
                    >
                      Send Another Message <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl">
                        ⚠️ {error}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-light-gray border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-light-gray border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-light-gray border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-light-gray border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>

              {/* Map Area */}
              <div className="bg-light-gray rounded-3xl overflow-hidden border border-gray-100 shadow-sm min-h-[400px] flex items-center justify-center relative">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-foreground mb-2">Visit Our Office</h3>
                  <p className="text-muted text-sm mb-1">Forever Healthcare Pvt. Ltd.</p>
                  <p className="text-muted text-sm">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
