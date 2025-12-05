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
                  Last updated: December 5, 2025
                </p>
                
                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Information We Collect
                </h3>
                <p>
                  When you visit our website, sign up for our newsletter, make a purchase, 
                  or contact us, we may collect personal information including your name, 
                  email address, shipping address, and payment information.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  How We Use Your Information
                </h3>
                <p>
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your merchandise orders</li>
                  <li>Send you newsletters and updates about new music and releases (with your consent)</li>
                  <li>Notify you about upcoming tour dates and shows</li>
                  <li>Respond to booking inquiries and press requests</li>
                  <li>Improve our website and your listening experience</li>
                </ul>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Third-Party Services
                </h3>
                <p>
                  We use the following third-party services to operate our website:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Shopify:</strong> Processes merchandise orders and payments securely. We do not store your payment card information.</li>
                  <li><strong>Printful:</strong> Fulfills and ships merchandise orders on our behalf.</li>
                  <li><strong>Vercel:</strong> Hosts our website.</li>
                </ul>

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
                  <a href="mailto:ofbloodband@gmail.com" className="text-primary hover:underline">
                    ofbloodband@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Terms of Service */}
            <div id="terms" className="scroll-mt-24 border-t border-line pt-16">
              <h2 className="font-display text-3xl font-bold mb-6">Terms of Service</h2>
              <div className="prose prose-invert max-w-none space-y-4 text-foreground/80">
                <p className="text-sm text-foreground/60">
                  Last updated: December 5, 2025
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
                  logos, music, lyrics, artwork, and videos, is the property of Of Blood 
                  and is protected by copyright and other intellectual property laws. 
                  Unauthorized reproduction, distribution, or use of our content is prohibited.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Music and Downloads
                </h3>
                <p>
                  Music available for streaming or download on this website is provided for 
                  personal, non-commercial use only. You may not redistribute, sell, or use 
                  our music for commercial purposes without written permission.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Merchandise Orders
                </h3>
                <p>
                  All merchandise orders are subject to availability. Prices are listed in USD 
                  and are subject to change. Payment is processed securely through Shopify. 
                  Merchandise is printed and fulfilled by Printful.
                </p>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Shipping and Returns
                </h3>
                <p>
                  Shipping times vary by location and are estimated at checkout. As our merchandise 
                  is printed on demand, we can only accept returns for defective or damaged items. 
                  Please contact us at{" "}
                  <a href="mailto:ofbloodband@gmail.com" className="text-primary hover:underline">
                    ofbloodband@gmail.com
                  </a>
                  {" "}within 14 days of delivery if you receive a defective item.
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
                  Last updated: December 5, 2025
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
                  Cookies We Use
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the website to function
                    properly, including your shopping cart and audio player preferences.
                  </li>
                  <li>
                    <strong>Shopify Cookies:</strong> Used by our e-commerce platform to 
                    process orders and maintain your cart between visits.
                  </li>
                </ul>

                <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-4">
                  Managing Cookies
                </h3>
                <p>
                  You can control and/or delete cookies through your browser settings. 
                  However, disabling cookies may affect some website functionality, 
                  such as the shopping cart.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div id="contact" className="scroll-mt-24 border-t border-line pt-16">
              <h2 className="font-display text-3xl font-bold mb-6">Contact</h2>
              <div className="prose prose-invert max-w-none space-y-4 text-foreground/80">
                <p>
                  For any questions regarding these policies or our website, please contact us at:
                </p>
                <p>
                  <a href="mailto:ofbloodband@gmail.com" className="text-primary hover:underline">
                    ofbloodband@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

