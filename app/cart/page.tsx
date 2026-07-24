"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, CreditCard, ChevronLeft, QrCode, Lock, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";


function CartPageContent() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Checkout Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online");

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const addToast = useCartStore((state) => state.addToast);
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutParam = searchParams.get("checkout") === "true";

  // Hydration guard — allow client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Manage checkout view state based on URL param
  useEffect(() => {
    if (checkoutParam) {
      setIsCheckingOut(true);
    } else {
      setIsCheckingOut(false);
    }
  }, [checkoutParam]);

  const handleProceedToCheckout = () => {
    router.push("/cart?checkout=true");
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setZipCode(code);
    
    if (code.length === 6 && /^\d+$/.test(code)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
        const data = await res.json();
        if (data && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setCity(postOffice.District || postOffice.Block || "");
          setState(postOffice.State || "");
          addToast("Location auto-filled!", "success");
        }
      } catch (err) {
        console.error("Failed to fetch pincode:", err);
      }
    }
  };

  // Pre-fill user data if available
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            if (!fullName) setFullName(data.data.name || "");
            if (!phone) setPhone(data.data.phone || "");
            if (!addressLine) setAddressLine(data.data.address || "");
            if (!city) setCity(data.data.city || "");
            if (!state) setState(data.data.state || "");
          }
        })
        .catch(console.error);
    }
  }, [session?.user?.email, isCheckingOut]);

  if (!mounted) return null;

  const subtotal = getTotalPrice();

  // Calculate Coupon Discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = subtotal * (appliedCoupon.discount / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.discount, subtotal);
    }
  }

  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.18;
  const total = discountedSubtotal + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponCode)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.data);
        setCouponSuccess(`Coupon "${data.data.code}" applied! ${data.data.description}`);
      } else {
        setCouponError(data.message || "Invalid or expired coupon.");
      }
    } catch {
      setCouponError("Error validating coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  const submitOrderToDatabase = async (details: { paymentMethod: string; paymentDetails?: any }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: session?.user?.email || localStorage.getItem("userEmail") || "guest@foreverhealthcare.in",
          items: cart.map(item => ({
            productId: item._id.substring(0, 24),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl
          })),
          totalAmount: total,
          paymentMethod: details.paymentMethod,
          paymentDetails: details.paymentDetails,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          discountAmount: discountAmount,
          shippingAddress: {
            fullName,
            phone,
            addressLine,
            city,
            state,
            zipCode
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        clearCart();
        addToast("Order placed successfully! Redirecting to My Orders...", "success");
        router.push("/profile?tab=Orders");
      } else {
        addToast("Order placement failed: " + data.error, "error");
      }
    } catch (error) {
      console.error("Order submit error:", error);
      addToast("Error submitting order. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!fullName || !phone || !addressLine || !city || !state || !zipCode) {
      addToast("Please fill in all shipping details", "error");
      return;
    }

    if (paymentMethod === "COD") {
      await submitOrderToDatabase({ paymentMethod: "COD" });
    } else {
      await processRazorpayPayment();
    }
  };

  const processRazorpayPayment = async () => {
    setLoading(true);

    const loadRazorpay = () =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      addToast("Failed to load Razorpay. Please check your connection.", "error");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount: total }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
         addToast(orderData.error || "Failed to initialize payment", "error");
         setLoading(false);
         return;
      }
      
      if (orderData.simulated) {
         await submitOrderToDatabase({ paymentMethod: "Online", paymentDetails: { orderId: orderData.orderId, simulated: true } });
         return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Forever Healthcare",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              await submitOrderToDatabase({
                 paymentMethod: "Online",
                 paymentDetails: {
                   orderId: response.razorpay_order_id,
                   paymentId: response.razorpay_payment_id
                 }
              });
            } else {
              addToast("Payment verification failed", "error");
              setLoading(false);
            }
          } catch {
            addToast("Payment verification failed", "error");
            setLoading(false);
          }
        },
        prefill: {
          name: fullName,
          email: session?.user?.email || "guest@foreverhealthcare.in",
          contact: phone,
        },
        theme: {
          color: "#43B97F"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
         addToast(response.error.description || "Payment failed", "error");
         setLoading(false);
      });
      razorpay.open();
    } catch (err: any) {
      addToast(err.message || "Error processing payment", "error");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-slate-50 min-h-screen">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-6 lg:pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
              {isCheckingOut ? "Checkout" : "Shopping Cart"}
            </h1>
            <p className="text-muted mt-2">
              {isCheckingOut
                ? "Verify details to place your cash-on-delivery order"
                : cart.length > 0
                ? `You have ${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`
                : "Your cart is empty"}
            </p>
          </div>
        </section>

        <section className="pb-12 lg:pb-16 pt-6 lg:pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {cart.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] p-12 md:p-20 text-center max-w-2xl mx-auto shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ShoppingBag className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold font-heading text-slate-800 mb-3">
                  Your cart is empty
                </h2>
                <p className="text-slate-500 mb-8 font-medium">
                  Looks like you haven&apos;t added any products to your cart yet.
                </p>
                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Left Side: Items or Checkout Address Form */}
                <div className="lg:col-span-2 space-y-4">
                  {!isCheckingOut ? (
                    // ── Cart Items List ──
                    cart.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base font-heading text-slate-800 truncate">
                            {item.name}
                          </h3>
                          <div className="text-emerald-600 font-extrabold mt-1 text-lg">
                            ₹{item.price.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-muted"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-bold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-muted"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:text-danger hover:bg-red-50 transition-all shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    // ── Checkout Shipping Form ──
                    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                        <button
                          onClick={() => setIsCheckingOut(false)}
                          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold font-heading text-slate-800">Shipping & Delivery Details</h2>
                      </div>
                      
                      <form onSubmit={handlePlaceOrder} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-650 text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Delivery Address</label>
                          <input
                            type="text"
                            value={addressLine}
                            onChange={(e) => setAddressLine(e.target.value)}
                            placeholder="Flat / House No., Apartment, Street"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                            required
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Pincode / Zip</label>
                            <input
                              type="text"
                              value={zipCode}
                              onChange={handlePincodeChange}
                              maxLength={6}
                              placeholder="e.g. 110001"
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Country</label>
                            <input
                              type="text"
                              value="India"
                              disabled
                              className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-transparent text-slate-500 font-medium outline-none cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City</label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State (India)</label>
                            <input
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              placeholder="e.g. Maharashtra"
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3 mt-6">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Method</label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("Online")}
                              className={`p-4 rounded-2xl flex border flex-col items-start gap-1 transition-all ${
                                paymentMethod === "Online"
                                  ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                                  : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <CreditCard className={`w-5 h-5 ${paymentMethod === "Online" ? "text-emerald-600" : "text-slate-400"}`} />
                                <span className="font-bold text-sm text-slate-800">Pay Online</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium">UPI, Cards, NetBanking</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setPaymentMethod("COD")}
                              className={`p-4 rounded-2xl flex border flex-col items-start gap-1 transition-all ${
                                paymentMethod === "COD"
                                  ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                                  : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Lock className={`w-5 h-5 ${paymentMethod === "COD" ? "text-emerald-600" : "text-slate-400"}`} />
                                <span className="font-bold text-sm text-slate-800">Cash on Delivery</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium">Pay when your order arrives</span>
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/10 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                          {loading ? "Placing Order..." : "Confirm & Place Order"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm sticky top-32">
                    <h3 className="font-bold text-xl font-heading mb-6 pb-4 border-b border-slate-100 text-slate-800">
                      Order Summary
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-semibold">Subtotal</span>
                        <span className="font-bold text-slate-700">₹{subtotal.toFixed(2)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600 font-bold">
                          <span>Discount ({appliedCoupon?.code})</span>
                          <span>-₹{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-semibold">Shipping</span>
                        <span className="font-bold text-emerald-600">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-semibold">GST (18%)</span>
                        <span className="font-bold text-slate-700">₹{tax.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Coupon Input Section */}
                    <div className="border-t border-slate-100 pt-4 pb-4">
                      <p className="text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">Promo / Coupon Code</p>
                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code (e.g. WELCOME10)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-600/30 text-xs font-bold uppercase"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                          >
                            {couponLoading ? "..." : "Apply"}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black text-emerald-800 uppercase block">{appliedCoupon.code}</span>
                            <span className="text-[10px] text-emerald-600 font-medium">{appliedCoupon.description}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      {couponError && <p className="text-[11px] text-red-500 font-bold mt-1.5">{couponError}</p>}
                      {couponSuccess && <p className="text-[11px] text-emerald-600 font-bold mt-1.5">{couponSuccess}</p>}
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-4 mb-6">
                      <span className="font-bold text-lg text-slate-800">Total</span>
                      <span className="font-black text-2xl text-emerald-600">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>

                    {!isCheckingOut ? (
                      <button
                        onClick={handleProceedToCheckout}
                        className="w-full bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] hover:opacity-90 text-white py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                      >
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/10 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        {loading ? "Placing Order..." : "Confirm & Place Order"}
                      </button>
                    )}

                    {/* Trust badges */}
                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>100% Genuine Ayurvedic Products</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Safe & Certified Fast Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-sm">Loading your cart...</p>
        </div>
      </div>
    }>
      <CartPageContent />
    </Suspense>
  );
}
