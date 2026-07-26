import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — My AI Picker",
  description: "The terms and conditions for using My AI Picker.",
  alternates: { canonical: "https://myaipicker.com/terms-and-conditions" },
};

export default function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 26, 2026</p>

      <div className="prose prose-invert mt-8 max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing and using My AI Picker (the &quot;Site&quot;), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">2. Use of the Site</h2>
          <p className="mt-2">You agree to use the Site only for lawful purposes. You must not:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Use the Site in any way that violates applicable laws or regulations.</li>
            <li>Attempt to gain unauthorized access to any part of the Site.</li>
            <li>Use automated scripts (bots) to scrape data without permission.</li>
            <li>Introduce viruses, malware, or other malicious code.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">3. Intellectual Property</h2>
          <p className="mt-2">
            The Site&apos;s design, text, graphics, and software are the property of My AI Picker and are protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">4. Third-Party Tools &amp; Links</h2>
          <p className="mt-2">
            The Site lists and compares AI tools operated by third parties. We do not control these third-party tools and are not responsible for their content, accuracy, or availability. Any reliance you place on information about third-party tools is strictly at your own risk.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">5. Pricing &amp; Data Accuracy</h2>
          <p className="mt-2">
            While we strive to keep pricing and capability data accurate and up-to-date (including automated daily updates from OpenRouter), we make no warranties or representations about the completeness or accuracy of the information. Prices and features of AI tools can change frequently. Always verify details on the official tool provider&apos;s website before making a purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">6. Limitation of Liability</h2>
          <p className="mt-2">
            My AI Picker shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of the Site, including but not limited to, any decisions made based on the information provided on the Site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">7. Affiliate Disclosure</h2>
          <p className="mt-2">
            Some links on the Site may be affiliate links. This means we may earn a commission if you click through and make a purchase, at no additional cost to you. We only recommend tools we believe are valuable. Affiliate relationships do not influence our benchmark scores or rankings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">8. Changes to Terms</h2>
          <p className="mt-2">
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Site constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">9. Governing Law</h2>
          <p className="mt-2">
            These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">10. Contact</h2>
          <p className="mt-2">
            If you have questions about these Terms, please contact us at: support@myaipicker.com
          </p>
        </section>
      </div>
    </div>
  );
}
