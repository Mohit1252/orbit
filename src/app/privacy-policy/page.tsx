import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — My AI Picker",
  description: "How My AI Picker collects, uses, and protects your data.",
  alternates: { canonical: "https://myaipicker.com/privacy-policy" },
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 26, 2026</p>

      <div className="prose prose-invert mt-8 max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">1. Introduction</h2>
          <p className="mt-2">
            Welcome to My AI Picker (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We operate myaipicker.com (the &quot;Site&quot;). This Privacy Policy explains how we collect, use, and protect your information when you visit our Site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">2. Information We Collect</h2>
          <p className="mt-2">We collect minimal data to provide and improve our service:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li><strong className="text-foreground">Local Storage Data:</strong> Your favorited tools and recently viewed tools are stored locally in your browser. We do not have access to this data.</li>
            <li><strong className="text-foreground">Usage Data:</strong> We may collect anonymous analytics data such as pages visited, time spent on site, and general location (country/city level) to understand how the Site is used.</li>
            <li><strong className="text-foreground">Newsletter Data:</strong> If you subscribe to our newsletter, we collect your email address.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">3. How We Use Your Information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>To operate, maintain, and improve the Site and its features.</li>
            <li>To send you our weekly newsletter if you subscribe (you can opt out anytime).</li>
            <li>To analyze usage patterns and optimize the user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">4. Cookies and Tracking</h2>
          <p className="mt-2">
            We do not use invasive tracking cookies. We may use privacy-friendly analytics (like Vercel Analytics or Plausible) that do not track you across other websites. We do not sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">5. Third-Party Links</h2>
          <p className="mt-2">
            Our Site contains links to external websites (AI tool providers). We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">6. Data Security</h2>
          <p className="mt-2">
            We take reasonable measures to protect your data. However, no method of transmission over the Internet is 100% secure. We use HTTPS encryption for all data transferred between your browser and our servers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">7. Your Rights</h2>
          <p className="mt-2">
            You have the right to access, correct, or delete your personal data. Since we store favorites and recently viewed items in your local browser storage, you can clear this data anytime via your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">8. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">9. Contact Us</h2>
          <p className="mt-2">
            If you have questions about this Privacy Policy, please contact us at: support@myaipicker.com
          </p>
        </section>
      </div>
    </div>
  );
}
