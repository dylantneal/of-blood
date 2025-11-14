"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PressAssetCardProps {
  imageSrc: string;
  alt: string;
  title: string;
  description: string;
  downloadFilename: string;
  aspectRatio?: "square" | "wide";
}

export function PressAssetCard({
  imageSrc,
  alt,
  title,
  description,
  downloadFilename,
  aspectRatio = "square",
}: PressAssetCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      // Use absolute URL for fetch
      const url = imageSrc.startsWith('/') ? `${window.location.origin}${imageSrc}` : imageSrc;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(imageSrc, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="group overflow-hidden hover:border-gold/50 transition-colors flex flex-col">
      <CardContent className="p-0">
        <div
          className={`relative ${
            aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]"
          } bg-muted`}
        >
          {aspectRatio === "square" ? (
            <div className="flex items-center justify-center p-8 h-full">
              <Image
                src={imageSrc}
                alt={alt}
                width={300}
                height={300}
                className="object-contain max-w-full max-h-full"
              />
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt={alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
      </CardContent>
      <CardHeader className="flex-1 flex flex-col">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-foreground/60 mb-4">{description}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full border-2 border-gold/30 hover:border-gold hover:bg-gold/10"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </CardHeader>
    </Card>
  );
}

