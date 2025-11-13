"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Instagram, Youtube, Music2, Disc } from "lucide-react";

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/ofbloodband/", handle: "@ofbloodband" },
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@OfBloodBand", handle: "@OfBloodBand" },
  { name: "TikTok", icon: Music2, href: "https://www.tiktok.com/@ofbloodband", handle: "@ofbloodband" },
  { name: "Bandcamp", icon: Disc, href: "https://ofblood.bandcamp.com", handle: "Of Blood" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    venue: "",
    date: "",
    message: "",
    type: "booking" as "booking" | "general" | "press",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          venue: "",
          date: "",
          message: "",
          type: "booking",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Header */}
      <Section className="pt-32 pb-16">
        <Container size="narrow" className="text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">Contact</h1>
          <p className="text-xl text-foreground/70">
            Booking inquiries, press requests, or just want to reach out.
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {status === "success" ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold">Message Sent!</h3>
                    <p className="text-foreground/70">
                      We've received your message and will respond within 48 hours.
                    </p>
                    <Button variant="ghost" onClick={() => setStatus("idle")}>
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as any })
                        }
                        className="h-12 w-full rounded-sm border border-line bg-muted px-4 text-base focus:outline-none focus:ring-2 focus:ring-gold"
                        required
                      >
                        <option value="booking">Booking</option>
                        <option value="press">Press / Media</option>
                        <option value="general">General</option>
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        disabled={status === "loading"}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        disabled={status === "loading"}
                      />
                    </div>

                    {/* Venue (for booking) */}
                    {formData.type === "booking" && (
                      <>
                        <div>
                          <label htmlFor="venue" className="block text-sm font-medium mb-2">
                            Venue
                          </label>
                          <Input
                            id="venue"
                            type="text"
                            value={formData.venue}
                            onChange={(e) =>
                              setFormData({ ...formData, venue: e.target.value })
                            }
                            disabled={status === "loading"}
                          />
                        </div>
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium mb-2">
                            Preferred Date
                          </label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            disabled={status === "loading"}
                          />
                        </div>
                      </>
                    )}

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        disabled={status === "loading"}
                        rows={6}
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-primary text-sm">
                        Something went wrong. Please try again.
                      </p>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={status === "loading"}
                      className="w-full"
                    >
                      {status === "loading" ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Info & Social */}
            <div className="space-y-8">
              {/* Email */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Direct Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:ofbloodband@gmail.com"
                    className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>ofbloodband@gmail.com</span>
                  </a>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
                          title={`Follow us on ${social.name}`}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium text-foreground">{social.name}</div>
                            <div className="text-sm">{social.handle}</div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Press Kit */}
              <Card className="bg-primary/5 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">Press Kit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 mb-4">
                    High-res photos, logos, and technical info for promoters and media.
                  </p>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/press">View Press Kit</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

