import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      {/* Symbol Logo */}
      <div className="relative h-10 w-10 transition-all duration-300 group-hover:opacity-80">
        <Image
          src="/images/logos/OfBloodSymbol.png"
          alt="Of Blood Symbol"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      
      {showWordmark && (
        <div className="relative h-8 w-32 transition-all duration-300 group-hover:opacity-80">
          <Image
            src="/images/logos/OfBlood_TextLogoTransparent.png"
            alt="Of Blood"
            fill
            className="object-contain object-left"
          />
        </div>
      )}
    </Link>
  );
}

