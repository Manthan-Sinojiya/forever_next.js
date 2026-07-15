import type { Metadata } from "next";
import { Inter, Poppins, Manrope } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/layout/ScrollProgress";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import SessionProvider from "@/components/providers/SessionProvider";
import CartDrawer from "@/components/layout/CartDrawer";
import ToastContainer from "@/components/layout/ToastContainer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Forever Healthcare | Discover Wellness - Premium Ayurvedic & Medical Products",
    template: "%s | Forever Healthcare",
  },
  description:
    "India's trusted premium healthcare brand offering 100% Ayurvedic supplements, certified medical equipment, doctor consultations, and wellness solutions. Export-quality products with fast delivery.",
  keywords: [
    "Healthcare",
    "Ayurvedic Products",
    "Medical Equipment",
    "Wellness",
    "Pharmacy",
    "Health Supplements",
    "Online Medicine",
    "Doctor Consultation",
    "Forever Healthcare",
    "Ayurveda",
    "Natural Products",
    "Health Care India",
  ],
  authors: [{ name: "Forever Healthcare", url: "https://foreverhealthcare.in" }],
  creator: "Forever Healthcare",
  publisher: "Forever Healthcare",
  metadataBase: new URL("https://foreverhealthcare.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://foreverhealthcare.in",
    siteName: "Forever Healthcare",
    title: "Forever Healthcare | Discover Wellness",
    description:
      "Premium Ayurvedic & medical products. Trusted by thousands of Indian families for quality healthcare solutions.",
    images: [
      {
        url: "/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "Forever Healthcare - Discover Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forever Healthcare | Discover Wellness",
    description:
      "Premium Ayurvedic & medical products. Trusted by thousands of Indian families.",
    images: ["/logo/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: "Forever Healthcare",
              url: "https://foreverhealthcare.in",
              logo: "https://foreverhealthcare.in/logo/logo.png",
              description:
                "India's trusted premium healthcare brand offering Ayurvedic supplements and medical equipment.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Mumbai",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-123-456-7890",
                contactType: "customer service",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://facebook.com/foreverhealthcare",
                "https://instagram.com/foreverhealthcare",
                "https://twitter.com/foreverhealthcare",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ScrollProgress />
        <SessionProvider>
          {children}
          <CartDrawer />
          <ToastContainer />
        </SessionProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
