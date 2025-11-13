import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Legal",
  description: "Privacy policy, terms of service, and legal information for Of Blood.",
};

export default function LegalPage() {
  return (
    <>
      {/* Header */}
      <Section className="pt-32 pb-16">
        <Container size="narrow" className="text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">Legal</h1>
          <p className="text-xl text-foreground/70">
            Privacy, terms, and policies.
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <div className="space-y-16">
            {/* Privacy Policy */}
            <div id="privacy" className="scroll-mt-24">
              <h2 className="font-display text-3xl font-bold mb-6">Privacy Policy</h2>
              <div className="prose prose-invert max-w-none space-y-4 text-foreground/80">
                <p className="text-sm text-foreground/60">
                  Last updated: November 12, 2025
                </p>
                
                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Information We Collect
                </h3>
                <p>
                  When you visit our website, sign up for our newsletter, or make a purchase,
                  we may collect personal information including your name, email address,
                  shipping address, and payment information.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  How We Use Your Information
                </h3>
                <p>
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process your orders and manage your account</li>
                  <li>Send you newsletters and promotional materials (with your consent)</li>
                  <li>Notify you about tour dates and new releases</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Data Security
                </h3>
                <p>
                  We implement appropriate security measures to protect your personal
                  information. Payment processing is handled securely through Shopify,
                  and we do not store payment card information on our servers.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Your Rights
                </h3>
                <p>
                  You have the right to access, correct, or delete your personal information.
                  You can unsubscribe from our newsletter at any time using the link in any
                  email we send you.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Contact Us
                </h3>
                <p>
                  For privacy-related questions, contact us at{" "}
                  <a href="mailto:privacy@ofblood.band" className="text-primary hover:underline">
                    privacy@ofblood.band
                  </a>
                </p>
              </div>
            </div>

            {/* Terms of Service */}
            <div id="terms" className="scroll-mt-24 border-t border-line pt-16">
              <h2 className="font-display text-3xl font-bold mb-6">Terms of Service</h2>
              <div className="prose prose-invert max-w-none space-y-4 text-foreground/80">
                <p className="text-sm text-foreground/60">
                  Last updated: November 12, 2025
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Use of Website
                </h3>
                <p>
                  By accessing this website, you agree to be bound by these terms of service.
                  If you do not agree with any part of these terms, you should not use our website.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Intellectual Property
                </h3>
                <p>
                  All content on this website, including but not limited to text, images,
                  logos, music, and videos, is the property of Of Blood or our licensors
                  and is protected by copyright and other intellectual property laws.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Orders and Payments
                </h3>
                <p>
                  All orders are subject to availability and confirmation of the order price.
                  We reserve the right to refuse any order. Payment is processed securely
                  through our e-commerce partner, Shopify.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Shipping and Returns
                </h3>
                <p>
                  Shipping times vary by location. Returns are accepted within 30 days
                  of delivery for unworn, undamaged merchandise with original tags attached.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Limitation of Liability
                </h3>
                <p>
                  Of Blood shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of this website
                  or any products purchased through it.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div id="cookies" className="scroll-mt-24 border-t border-line pt-16">
              <h2 className="font-display text-3xl font-bold mb-6">Cookie Policy</h2>
              <div className="prose prose-invert max-w-none space-y-4 text-foreground/80">
                <p className="text-sm text-foreground/60">
                  Last updated: November 12, 2025
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  What Are Cookies
                </h3>
                <p>
                  Cookies are small text files stored on your device when you visit our website.
                  They help us provide you with a better experience by remembering your
                  preferences and understanding how you use our site.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Types of Cookies We Use
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the website to function
                    properly (e.g., shopping cart, user authentication)
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how visitors
                    interact with our website
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used to track visitors across
                    websites to display relevant advertisements
                  </li>
                </ul>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Managing Cookies
                </h3>
                <p>
                  You can control and/or delete cookies as you wish through your browser
                  settings. However, disabling certain cookies may affect the functionality
                  of our website.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

