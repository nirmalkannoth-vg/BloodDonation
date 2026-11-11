import { Metadata } from "next";
import Link from "next/link";
import { BloodRequestForm } from "@/components/forms/blood-request-form";
import { getBloodGroups, getAllSettings } from "@/services/public";
import { DEFAULT_SETTINGS } from "@/config/constants";
import {
  ArrowDown,
  ArrowRight,
  Clock,
  Droplet,
  FileText,
  Lock,
  Phone,
  PhoneCall,
  Search,
  Send,
  Siren,
  Smartphone,
  Hospital,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Request Blood",
  description:
    "Submit a blood request through Blood Connect – InfoPark News Initiate, Kochi. We connect patients with registered blood donors for life-saving transfusions.",
};

export const dynamic = "force-dynamic";

const steps = [
  { icon: Send, title: "Send your request", text: "Takes about a minute." },
  { icon: Search, title: "We find donors", text: "We contact matching registered donors." },
  { icon: PhoneCall, title: "We call you back", text: "To coordinate the donation at your hospital." },
];

const tips = [
  { icon: Smartphone, text: "Keep your phone switched on and reachable." },
  { icon: Hospital, text: "Mention the hospital, patient name and units needed." },
  { icon: FileText, text: "Keep the doctor's requisition form ready for the blood bank." },
];

export default async function RequestBloodPage() {
  const [bloodGroups, settings] = await Promise.all([getBloodGroups(), getAllSettings()]);

  const contactPhone = settings.CONTACT_PHONE || DEFAULT_SETTINGS.CONTACT_PHONE;
  const contactPhoneTel = contactPhone.replace(/[^\d+]/g, "");

  const highlights = [
    {
      icon: Siren,
      title: "Emergency line",
      text: (
        <a href={`tel:${contactPhoneTel}`} className="font-semibold text-primary hover:underline">
          {contactPhone}
        </a>
      ),
    },
    { icon: Clock, title: "Quick response", text: "Usually within 30 min – 2 hours." },
    { icon: Lock, title: "Private & secure", text: "Only our team sees your details." },
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
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            We&apos;re here to help
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Request Blood
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Tell us what&apos;s needed and we&apos;ll connect you with registered donors — fast.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${contactPhoneTel}`}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-red-700 shadow-lg shadow-red-900/20 transition-colors hover:bg-white/90"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Emergency? Call {contactPhone}
            </a>
            <a
              href="#request-form"
              className="inline-flex h-12 items-center gap-2 rounded-xl px-6 text-base font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
            >
              Fill the request form
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Highlights — overlapping the hero */}
      <section className="relative z-10 -mt-14 lg:-mt-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-5">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg shadow-gray-200/60"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold text-gray-900">{title}</h2>
                  <div className="text-sm text-gray-600">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <BloodRequestForm bloodGroups={bloodGroups} contactPhone={contactPhone} />

            <aside className="space-y-5 lg:sticky lg:top-24">
              {/* How it works */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">How it works</h2>
                <ol className="relative mt-4 space-y-5 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-rose-100">
                  {steps.map(({ icon: Icon, title, text }) => (
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

              {/* Tips */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Get help faster</h2>
                <ul className="mt-4 space-y-3">
                  {tips.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="pt-1.5">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency call */}
              <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-[#141a2e] p-6 text-white shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Siren className="h-5 w-5 text-red-400" aria-hidden="true" />
                  Critical emergency?
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  Don&apos;t wait for a call back — phone us directly.
                </p>
                <a
                  href={`tel:${contactPhoneTel}`}
                  className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {contactPhone}
                </a>
                <Link
                  href="/donate"
                  className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-4 text-sm text-white/80 hover:text-white"
                >
                  Want to help others? Become a donor
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
