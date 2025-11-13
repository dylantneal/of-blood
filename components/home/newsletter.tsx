"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, use status text
        setStatus("error");
        setErrorMessage(`Server error: ${response.statusText || "Unknown error"}`);
        return;
      }

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <Section className="bg-gradient-to-b from-background to-muted/30">
      <Container size="narrow">
        <div className="text-center space-y-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Join the Blood Pact
            </h2>
            <p className="text-foreground/70 text-lg">
              Get exclusive access to new releases, tour announcements, and limited merch drops.
            </p>
          </div>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 text-gold">
              <Check className="w-5 h-5" />
              <p>You're in. Check your email to confirm.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
                className="flex-1"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={status === "loading"}
                className="sm:w-auto"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}

          {status === "error" && (
            <p className="text-primary text-sm">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}

