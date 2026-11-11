import Link from "next/link";
import { getAllSettings } from "@/services/public";
import { DEFAULT_SETTINGS } from "@/config/constants";
import { BrandLogo } from "./brand-logo";

const footerLinks = [
  { name: "About Us", href: "/about" },
  { name: "Health Awareness", href: "/health-awareness" },
  { name: "Contact", href: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms" },
];

// Brand glyphs (lucide-react no longer ships brand icons)
const socialIcons: Record<string, { label: string; path: string }> = {
  SOCIAL_FACEBOOK: {
    label: "Facebook",
    path: "M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6V14h2.8v8h3.1Z",
  },
  SOCIAL_YOUTUBE: {
    label: "YouTube",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  },
  SOCIAL_LINKEDIN: {
    label: "LinkedIn",
    path: "M6.9 8.6H3.8V20h3.1V8.6ZM5.3 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.4c0-3-.7-5.1-4.1-5.1-1.6 0-2.7.9-3.2 1.7V8.6H10V20h3.1v-5.6c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.2v-6.6Z",
  },
  SOCIAL_INSTAGRAM: {
    label: "Instagram",
    path: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.5a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm4.8-8.8a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3.6c2.3 0 2.5 0 3.4.1 2.3.1 3.4 1.2 3.5 3.5.1.9.1 1.2.1 3.4v2.8c0 2.3 0 2.5-.1 3.4-.1 2.3-1.2 3.4-3.5 3.5-.9.1-1.1.1-3.4.1s-2.5 0-3.4-.1c-2.3-.1-3.4-1.2-3.5-3.5-.1-.9-.1-1.1-.1-3.4V10.6c0-2.3 0-2.5.1-3.4C5.2 4.9 6.3 3.8 8.6 3.7c.9-.1 1.1-.1 3.4-.1ZM12 2c-2.4 0-2.7 0-3.6.1C5.2 2.2 3.4 4 3.2 7.2 3.1 8.1 3.1 8.4 3.1 12s0 2.7.1 3.6c.1 3.2 1.9 5 5.1 5.1.9.1 1.2.1 3.6.1s2.7 0 3.6-.1c3.2-.1 5-1.9 5.1-5.1.1-.9.1-1.2.1-3.6s0-2.7-.1-3.6c-.1-3.2-1.9-5-5.1-5.1C14.7 2 14.4 2 12 2Z",
  },
  SOCIAL_TWITTER: {
    label: "X (Twitter)",
    path: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z",
  },
};

function isHttpUrl(value: string | undefined): value is string {
  return !!value && /^https?:\/\//i.test(value.trim());
}

export async function PublicFooter() {
  const settings = await getAllSettings();

  const ngoName = settings.NGO_NAME || DEFAULT_SETTINGS.NGO_NAME;
  const city = settings.CITY || DEFAULT_SETTINGS.CITY;
  const currentYear = new Date().getFullYear();

  // Only show icons for profiles configured in Admin → Settings → Social Media
  const socials = Object.entries(socialIcons)
    .map(([key, icon]) => ({ ...icon, key, url: settings[key]?.trim() }))
    .filter((s) => isHttpUrl(s.url));

  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col items-center gap-8 py-10 lg:flex-row lg:justify-between lg:gap-6">
          <BrandLogo size="lg" />

          <nav aria-label="Footer" className="flex items-center lg:border-x lg:border-gray-300 lg:px-8">
            {footerLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 text-sm text-gray-800 transition-colors hover:text-primary ${
                  i > 0 ? "border-l border-gray-300" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {socials.length > 0 && (
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141a2e] text-white transition-colors hover:bg-primary"
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          )}

          <p className="text-base italic text-gray-800">Donate Blood... Save Lives...</p>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-gray-200 py-5 text-center text-xs text-gray-500 md:flex-row md:justify-between md:text-left">
          <p>
            © {currentYear} {ngoName} – InfoPark News Initiate, {city}. Final donation eligibility is
            determined by qualified healthcare professionals.
          </p>
          <div className="flex gap-4">
            {legalLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-primary">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
