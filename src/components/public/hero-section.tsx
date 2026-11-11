import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Droplet,
  Heart,
  HeartPulse,
  Hospital,
  Users,
} from "lucide-react";

/** Path (under /public) of the optional hero photo. See README "Landing page images". */
export const HERO_IMAGE_SRC = "/images/hero-donor.png";

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function HeroDropArt() {
  // Fallback artwork shown until /public/images/hero-donor.png is added
  return (
    <svg viewBox="0 0 420 540" aria-hidden="true" className="h-full max-h-[460px] w-auto max-w-full py-6">
      <defs>
        <linearGradient id="hero-drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff3b3b" />
          <stop offset="100%" stopColor="#c81414" />
        </linearGradient>
      </defs>
      <path
        d="M210 30C210 30 50 230 50 335a160 160 0 0 0 320 0C370 230 210 30 210 30Z"
        fill="none"
        stroke="url(#hero-drop)"
        strokeWidth="38"
        strokeLinejoin="round"
      />
      <path
        d="M150 345a62 62 0 1 0 62-62"
        fill="none"
        stroke="url(#hero-drop)"
        strokeWidth="34"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeroSection({ hasHeroImage = false }: { hasHeroImage?: boolean }) {
  return (
    // Background matches the hero photo's backdrop (#F0F0F1) so they join seamlessly
    <section className="relative overflow-hidden bg-[#f0f0f1]">
      {/* Soft background shapes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-rose-100/60 blur-3xl" />
        <div className="absolute right-1/4 bottom-[-10rem] h-80 w-80 rounded-full bg-rose-50 blur-3xl" />
      </div>

      {/* lg:static so the photo is positioned against the full-width section (bleeds to the right edge) */}
      <div className="container relative mx-auto px-4 lg:static lg:px-6">
        <div className="grid items-center gap-8 py-12 lg:min-h-[540px] lg:grid-cols-2 lg:py-16">
          {/* Copy */}
          <div className="relative z-10 max-w-xl">
            <p className="font-display text-6xl font-extrabold leading-none text-primary lg:text-7xl">#</p>
            <h1 className="font-display text-7xl font-extrabold uppercase leading-[0.9] tracking-tight text-[#141a2e] sm:text-8xl lg:text-[7.5rem]">
              Be a <span className="text-primary">Hero</span>
            </h1>
            <p className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-[#141a2e] sm:text-4xl">
              You don&apos;t have to be a doctor
              <br />
              <span className="text-primary">to save a life.</span>
            </p>
            <div className="mt-6 h-1 w-14 rounded-full bg-primary" />

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-xl px-6 text-base font-semibold shadow-lg shadow-primary/20">
                <Link href="/donate">
                  <Droplet className="w-5 h-5" fill="currentColor" />
                  Become a Donor
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-gray-300 bg-white px-6 text-base font-semibold text-gray-900 hover:bg-gray-50"
              >
                <Link href="/request-blood">
                  <Droplet className="w-5 h-5 text-gray-900" fill="currentColor" />
                  Request Blood
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative h-[320px] sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[55%]">
            {hasHeroImage ? (
              <Image
                src={HERO_IMAGE_SRC}
                alt="Blood donor's arm with a bandage after donating, in front of a red blood drop"
                fill
                preload
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-contain object-right [mask-image:linear-gradient(to_right,transparent,black_18%)]"
              />
            ) : (
              <div className="flex h-full items-center justify-center lg:justify-end lg:pr-16">
                <HeroDropArt />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Impact stats                                                               */
/* -------------------------------------------------------------------------- */

const stats = [
  { icon: Users, value: "500+", label: "Registered Donors" },
  { icon: HeartPulse, value: "200+", label: "Lives Saved" },
  { icon: Hospital, value: "50+", label: "Partner Hospitals" },
];

export function ImpactStatsSection() {
  return (
    <section className="bg-white pb-16 lg:pb-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/70">
          {/* Wave decoration */}
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-rose-200/50"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 50 C200 10 400 80 600 45 S1000 10 1200 40 V80 H0Z" fill="currentColor" />
          </svg>

          <div className="relative grid grid-cols-1 divide-y divide-rose-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center justify-center gap-5 px-6 py-8 lg:py-10">
                <Icon className="h-12 w-12 shrink-0 text-primary lg:h-16 lg:w-16" strokeWidth={1.75} />
                <div>
                  <p className="font-display text-4xl font-bold leading-none text-primary lg:text-5xl">{value}</p>
                  <p className="mt-1 text-sm text-gray-800 lg:text-base">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

const steps = [
  { icon: Droplet, title: "1. Register", text: "Sign up as a donor in just a few clicks." },
  { icon: CalendarDays, title: "2. Donate", text: "Visit the donation center at your convenience." },
  { icon: Heart, title: "3. Save Lives", text: "Your donation can help someone in need." },
];

export function SectionHeading({ lead, accent }: { lead: string; accent: string }) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      <span className="h-px w-12 bg-primary/60 sm:w-20" aria-hidden="true" />
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
        {lead} <span className="text-primary">{accent}</span>
      </h2>
      <span className="h-px w-12 bg-primary/60 sm:w-20" aria-hidden="true" />
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="bg-white pb-16 lg:pb-24">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionHeading lead="How It" accent="Works" />

        <ol className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="contents">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-rose-50">
                  <Icon className="h-9 w-9 text-primary" fill={i === 1 ? "none" : "currentColor"} strokeWidth={i === 1 ? 2 : 1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{text}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden h-7 w-7 text-primary md:block" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Call to action banner                                                      */
/* -------------------------------------------------------------------------- */

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-red-700 py-16 lg:py-20">
      {/* Heart line-art (left) */}
      <svg
        className="pointer-events-none absolute -left-4 top-1/2 hidden h-40 w-80 -translate-y-1/2 text-white/40 md:block"
        viewBox="0 0 320 160"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 120 C60 120 90 110 120 95 C150 80 150 40 125 32 C105 26 92 45 100 62 C108 80 140 100 175 108 C215 117 260 118 320 112"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M125 32 C130 18 152 14 160 30 C168 46 150 70 120 95"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Heartbeat line (right) */}
      <svg
        className="pointer-events-none absolute right-0 top-1/2 hidden h-24 w-80 -translate-y-1/2 text-white/40 md:block"
        viewBox="0 0 320 96"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 50 H110 L125 50 L140 15 L158 85 L172 30 L184 60 L195 50 H320"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <div className="container relative mx-auto px-4 text-center lg:px-6">
        <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-white lg:text-5xl">
          Your one donation. Three possible lives.
        </h2>
        <p className="mt-3 text-lg text-white/90 lg:text-xl">Be someone&apos;s reason to smile tomorrow.</p>
        <Button
          asChild
          size="lg"
          className="mt-8 h-12 rounded-xl bg-white px-6 text-base font-semibold text-gray-900 shadow-lg hover:bg-white/90"
        >
          <Link href="/donate">
            <Droplet className="w-5 h-5 text-primary" fill="currentColor" />
            Become a Donor
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
