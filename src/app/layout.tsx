import type { Metadata } from "next";
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
  title: "My AI Picker — Find the right AI tool for any mission",
  description:
    "My AI Picker is the AI tool universe. Compare 500+ AI models by task, budget and capability — writing, coding, images, video, voice, data and agents. Find your perfect match in seconds.",
  keywords: [
    "AI tools",
    "compare AI",
    "AI model comparison",
    "find AI tool",
    "ChatGPT",
    "Claude",
    "Midjourney",
    "AI directory",
  ],
  authors: [{ name: "My AI Picker" }],
  icons: {
    icon: "/logo-myaipicker.png",
  },
  openGraph: {
    title: "My AI Picker — Find the right AI tool for any mission",
    description:
      "Compare 80+ AI models by task, budget and capability. Your shortcut to the right AI.",
    siteName: "My AI Picker",
    type: "website",
    url: "https://myaipicker.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "My AI Picker — Find the right AI tool for any mission",
    description:
      "Compare 500+ AI models by task, budget and capability. Your shortcut to the right AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
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
