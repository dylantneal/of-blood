"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Show } from "@/lib/types";
import { Trash2, Plus, Copy, Check, LogOut } from "lucide-react";

export function TourAdminClient() {
  const [shows, setShows] = useState<Show[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load current shows from API
  useEffect(() => {
    fetch("/api/admin/shows")
      .then((res) => {
        if (res.status === 401) {
          // Unauthorized - redirect to login
          router.push("/admin/login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          // Sort by date
          const sorted = [...data].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setShows(sorted);
        } else {
          setShows([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading shows:", err);
        // Start with empty array if file doesn't exist
        setShows([]);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addShow = () => {
    const newShow: Show = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      city: "",
      venue: "",
      ticketUrl: "",
      onSale: false,
      isSoldOut: false,
    };
    setShows([...shows, newShow]);
  };

  const updateShow = (id: string, field: keyof Show, value: string | boolean) => {
    setShows(
      shows.map((show) => (show.id === id ? { ...show, [field]: value } : show))
    );
  };

  const deleteShow = (id: string) => {
    setShows(shows.filter((show) => show.id !== id));
  };

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(shows, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const jsonOutput = JSON.stringify(shows, null, 2);

  if (loading) {
    return (
      <Section className="pt-32 pb-16">
        <Container size="narrow">
          <div className="text-center text-foreground/70">Loading...</div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section className="pt-32 pb-16">
        <Container size="narrow">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                Tour Dates Admin
              </h1>
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
            <p className="text-foreground/70 mb-6">
              Edit your tour dates below. When you're done, copy the JSON output and paste it into{" "}
              <code className="bg-muted px-2 py-1 rounded text-sm">data/shows.json</code>
            </p>
          </div>

          {/* Shows List */}
          <div className="space-y-4 mb-8">
            {shows.map((show) => (
              <Card key={show.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Show #{shows.indexOf(show) + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteShow(show.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date *</label>
                      <Input
                        type="date"
                        value={show.date}
                        onChange={(e) => updateShow(show.id, "date", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <Input
                        type="text"
                        value={show.city}
                        onChange={(e) => updateShow(show.id, "city", e.target.value)}
                        placeholder="Los Angeles"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <Input
                        type="text"
                        value={show.state || ""}
                        onChange={(e) => updateShow(show.id, "state", e.target.value)}
                        placeholder="CA"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Venue *</label>
                      <Input
                        type="text"
                        value={show.venue}
                        onChange={(e) => updateShow(show.id, "venue", e.target.value)}
                        placeholder="The Roxy Theatre"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ticket URL</label>
                      <Input
                        type="url"
                        value={show.ticketUrl || ""}
                        onChange={(e) => updateShow(show.id, "ticketUrl", e.target.value)}
                        placeholder="https://example.com/tickets"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={show.onSale || false}
                        onChange={(e) => updateShow(show.id, "onSale", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">On Sale</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={show.isSoldOut || false}
                        onChange={(e) => updateShow(show.id, "isSoldOut", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Sold Out</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            ))}

            {shows.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-foreground/50">
                  No shows yet. Click "Add Show" to get started.
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button onClick={addShow} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Show
            </Button>
            <Button onClick={copyToClipboard} variant="ghost">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>

          {/* JSON Output */}
          <Card>
            <CardHeader>
              <CardTitle>JSON Output</CardTitle>
              <p className="text-sm text-foreground/70 mt-2">
                Copy this and paste it into <code className="bg-muted px-1 rounded">data/shows.json</code>
              </p>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded overflow-auto text-sm font-mono">
                {jsonOutput}
              </pre>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-8 border-gold/50">
            <CardHeader>
              <CardTitle className="text-gold">How to Save Changes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ol className="list-decimal list-inside space-y-2 text-foreground/70">
                <li>Edit the shows above using the form</li>
                <li>Click "Copy JSON" to copy the formatted JSON</li>
                <li>Open <code className="bg-muted px-1 rounded">data/shows.json</code> in your code editor</li>
                <li>Replace the entire contents with the copied JSON</li>
                <li>Save the file</li>
                <li>The changes will appear on your site after the page refreshes</li>
              </ol>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}

