"use client";

import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { FilterPanel } from "@/components/site/filter-panel";
import { Categories } from "@/components/site/categories";
import { FeaturedTools } from "@/components/site/featured-tools";
import { Comparison } from "@/components/site/comparison";
import { HowItWorks } from "@/components/site/how-it-works";
import { Stats } from "@/components/site/stats";
import { CTA } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="mt-4 lg:-mt-6">
          <FilterPanel />
        </div>
        <Categories />
        <FeaturedTools />
        <Comparison />
        <div className="py-8">
          <Stats />
        </div>
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
