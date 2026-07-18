"use client";

import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { FilterPanel } from "@/components/site/filter-panel";
import { Categories } from "@/components/site/categories";
import { TrendingLaunches } from "@/components/site/trending-launches";
import { FeaturedTools } from "@/components/site/featured-tools";
import { Comparison } from "@/components/site/comparison";
import { HowItWorks } from "@/components/site/how-it-works";
import { Stats } from "@/components/site/stats";
import { Testimonials } from "@/components/site/testimonials";
import { CTA } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";
import { ToolDetailDialog } from "@/components/site/tool-detail-dialog";
import { QuizDialog } from "@/components/site/quiz-dialog";
import { RecentlyViewed } from "@/components/site/recently-viewed";
import { FloatingControls } from "@/components/site/floating-controls";
import { StoreHydration } from "@/components/site/store-hydration";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="mt-4 lg:-mt-6">
          <FilterPanel />
        </div>
        <RecentlyViewed />
        <Categories />
        <TrendingLaunches />
        <FeaturedTools />
        <Comparison />
        <div className="py-8">
          <Stats />
        </div>
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <ToolDetailDialog />
      <QuizDialog />
      <FloatingControls />
    </div>
  );
}
