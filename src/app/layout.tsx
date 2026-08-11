import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myaipicker.com"),
  title: {
    default: "My AI Picker — Compare 130+ AI Tools & Find the Right One (2026)",
    template: "%s | My AI Picker",
  },
  description:
    "Compare 130+ AI tools by task, budget, and real benchmarks. ChatGPT vs Claude, Midjourney vs DALL·E, Cursor vs Copilot — pricing, specs, and reviews for every AI model in 2026. Find your perfect AI match in seconds.",
  keywords: [
    "AI tools",
    "compare AI",
    "AI model comparison",
    "find AI tool",
    "best AI tools 2026",
    "ChatGPT vs Claude",
    "Midjourney vs DALL·E",
    "Cursor vs Copilot",
    "AI directory",
    "AI tool finder",
    "AI pricing comparison",
    "AI benchmarks",
  ],
  authors: [{ name: "My AI Picker" }],
  creator: "My AI Picker",
  publisher: "My AI Picker",
  icons: {
    icon: "/logo-myaipicker.png",
    apple: "/logo-myaipicker.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://myaipicker.com",
  },
  openGraph: {
    title: "My AI Picker — Compare 130+ AI Tools & Find the Right One (2026)",
    description:
      "Compare 130+ AI tools by task, budget, and real benchmarks. ChatGPT vs Claude, Midjourney vs DALL·E, Cursor vs Copilot — find your perfect AI match in seconds.",
    siteName: "My AI Picker",
    type: "website",
    url: "https://myaipicker.com",
    locale: "en_US",
    images: [
      {
        url: "https://myaipicker.com/og-image.png",
        width: 1024,
        height: 1024,
        alt: "My AI Picker — Compare 130+ AI tools by task, budget, and benchmarks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My AI Picker — Compare 130+ AI Tools (2026)",
    description:
      "Compare 130+ AI tools by task, budget, and real benchmarks. Find your perfect AI match in seconds.",
    images: ["https://myaipicker.com/og-image.png"],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-H3EHC0JLB0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H3EHC0JLB0');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
