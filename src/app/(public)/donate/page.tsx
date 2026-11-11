import { Metadata } from "next";
import Link from "next/link";
import { DonorRegistrationForm } from "@/components/forms/donor-registration-form";
import { getAllSettings, getBloodGroups } from "@/services/public";
import { DEFAULT_SETTINGS } from "@/config/constants";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Clock,
  Droplet,
  Heart,
  HeartHandshake,
  Lock,
  Phone,
  PhoneCall,
  Scale,
  Shield,
  ShieldCheck,
  Smile,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Become a Blood Donor",
  description:
    "Register as a blood donor with Blood Connect – InfoPark News Initiate, Kochi. Your donation can save up to 3 lives. Join our community of heroes today.",
};

export const dynamic = "force-dynamic";

const benefits = [
  { icon: Heart, title: "Save Lives", description: "One donation can save up to 3 lives." },
  { icon: Shield, title: "Free Health Check", description: "A mini health screening before each donation." },
  { icon: Clock, title: "Quick Process", description: "The whole donation takes only 30–45 minutes." },
  { icon: Users, title: "Join Community", description: "Be part of a caring community making a difference." },
];

const nextSteps = [
  { icon: ShieldCheck, title: "We verify", text: "Our team reviews your registration." },
  { icon: PhoneCall, title: "We call you", text: "Only when a patient needs your blood group." },
  { icon: HeartHandshake, title: "You save a life", text: "Donate at the hospital or blood bank." },
];

export default async function DonatePage() {
  const [bloodGroups, settings] = await Promise.all([getBloodGroups(), getAllSettings()]);

  const parsedInterval = parseInt(
    settings.DONATION_ELIGIBILITY_INTERVAL_DAYS || DEFAULT_SETTINGS.DONATION_ELIGIBILITY_INTERVAL_DAYS,
    10
  );
  const intervalDays = Number.isFinite(parsedInterval) && parsedInterval > 0 ? parsedInterval : 90;
  const contactPhone = settings.CONTACT_PHONE?.trim();

  const eligibility = [
    { icon: Smile, text: "Aged 18 to 65 years" },
    { icon: Scale, text: "Weigh at least 50 kg" },
    { icon: Heart, text: "Healthy and feeling well on the day" },
    { icon: CalendarClock, text: `${intervalDays}+ days since your last donation` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-red-700 pb-24 pt-14 lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-red-900/30 blur-3xl" />
          <svg
            className="absolute right-0 top-1/2 hidden h-24 w-96 -translate-y-1/2 text-white/25 md:block"
            viewBox="0 0 320 96"
            fill="none"
          >
            <path
              d="M0 50 H110 L125 50 L140 15 L158 85 L172 30 L184 60 L195 50 H320"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <Droplet className="absolute left-[8%] top-1/2 hidden h-20 w-20 -translate-y-1/2 text-white/10 md:block" fill="currentColor" />
        </div>

        <div className="container relative mx-auto px-4 text-center lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur">
            <Droplet className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            Every drop counts
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Become a Blood Donor
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Join our community of life-savers. Register once and we&apos;ll reach out when someone
            nearby needs your blood group.
          </p>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/90">
            {[
              { icon: Clock, text: "Takes 2 minutes" },
              { icon: Lock, text: "Details kept private" },
              { icon: Check, text: "No obligation" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits — overlapping the hero */}
      <section className="relative z-10 -mt-14 lg:-mt-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-lg shadow-gray-200/60 transition-transform hover:-translate-y-0.5 sm:p-5"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h2 className="font-semibold text-gray-900">{title}</h2>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <DonorRegistrationForm bloodGroups={bloodGroups} eligibilityIntervalDays={intervalDays} />

            <aside className="space-y-5 lg:sticky lg:top-24">
              {/* Eligibility */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Can I donate?</h2>
                <p className="mt-1 text-sm text-gray-500">You can usually donate if you are:</p>
                <ul className="mt-4 space-y-3">
                  {eligibility.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  Final eligibility is confirmed by qualified healthcare staff at the time of donation.
                </p>
              </div>

              {/* What happens next */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">What happens next?</h2>
                <ol className="relative mt-4 space-y-5 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-rose-100">
                  {nextSteps.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="relative flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white ring-4 ring-white">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        <p className="text-sm text-gray-500">{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Help */}
              <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-[#141a2e] p-6 text-white shadow-sm">
                <h2 className="text-lg font-bold">Need blood instead?</h2>
                <p className="mt-1 text-sm text-white/70">
                  Submit a request and our team will help find a matching donor.
                </p>
                <Link
                  href="/request-blood"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-red-300"
                >
                  Request Blood
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                    className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-white/80 hover:text-white"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {contactPhone}
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
