import Link from "next/link";
import { cn } from "@/lib/utils";

/** Red blood drop with a white heart — the Blood Connect mark. */
export function BloodDropMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" aria-hidden="true" className={cn("w-10 h-12 shrink-0", className)}>
      <path
        d="M24 1.5C24 1.5 3 25.5 3 36.5a21 21 0 0 0 42 0C45 25.5 24 1.5 24 1.5Z"
        className="fill-primary"
      />
      <path
        transform="translate(13.2 25.6) scale(0.9)"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#fff"
      />
    </svg>
  );
}

interface BrandLogoProps {
  className?: string;
  size?: "md" | "lg";
  onClick?: () => void;
}

export function BrandLogo({ className, size = "md", onClick }: BrandLogoProps) {
  return (
    <Link href="/" onClick={onClick} className={cn("flex items-center gap-2.5", className)}>
      <BloodDropMark className={size === "lg" ? "w-11 h-[3.25rem]" : undefined} />
      <span className="leading-tight">
        <span
          className={cn(
            "block font-bold text-gray-900 tracking-tight",
            size === "lg" ? "text-2xl" : "text-xl"
          )}
        >
          Blood Connect
        </span>
        <span className="block text-[11px] font-semibold text-primary tracking-wide">
          InfoPark News Initiate - Kochi
        </span>
      </span>
    </Link>
  );
}
