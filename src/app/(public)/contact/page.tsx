import { Metadata } from "next";
import Link from "next/link";
import { getAllSettings } from "@/services/public";
import { DEFAULT_SETTINGS } from "@/config/constants";
import { ContactForm } from "@/components/forms/contact-form";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Siren,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Blood Connect – InfoPark News Initiate, Kochi. We're here to help with blood donation queries, requests, and partnerships.",
};

export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "I need blood urgently — what should I do?",
    a: (
      <>
        Call us right away and also submit a{" "}
        <Link href="/request-blood" className="font-semibold text-primary hover:underline">
          blood request
        </Link>{" "}
        marked as <em>Urgent</em> so our whole team is alerted.
      </>
    ),
  },
  {
    q: "How do I become a donor?",
    a: (
      <>
        Fill the 2-minute{" "}
        <Link href="/donate" className="font-semibold text-primary hover:underline">
          donor registration form
        </Link>
        . We&apos;ll contact you only when your blood group is needed.
      </>
    ),
  },
  {
    q: "Can my company host a blood donation camp?",
    a: "Yes! Send us a message choosing “Organise a Camp” and our volunteers will help you plan it.",
  },
  {
    q: "Will my details be shared publicly?",
    a: "Never. Your details are only seen by our coordination team and used to arrange donations.",
  },
];

export default async function ContactPage() {
  const settings = await getAllSettings();

  const phone = settings.CONTACT_PHONE || DEFAULT_SETTINGS.CONTACT_PHONE;
  const email = settings.CONTACT_EMAIL || DEFAULT_SETTINGS.CONTACT_EMAIL;
  const address = settings.ADDRESS || DEFAULT_SETTINGS.ADDRESS;
  const city = settings.CITY || DEFAULT_SETTINGS.CITY;
  const state = settings.STATE || DEFAULT_SETTINGS.STATE;

  const phoneTel = phone.replace(/[^\d+]/g, "");
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappNumber = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
  const fullAddress = `${address}, ${city}, ${state}`;
  const mapQuery = encodeURIComponent(fullAddress);

  const quickActions: {
    icon: LucideIcon;
    title: string;
    value: string;
    href: string;
    accent: string;
    external?: boolean;
  }[] = [
    { icon: Phone, title: "Call us", value: phone, href: `tel:${phoneTel}`, accent: "bg-red-50 text-primary" },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${whatsappNumber}`,
      accent: "bg-emerald-50 text-emerald-600",
      external: true,
    },
    { icon: Mail, title: "Email", value: email, href: `mailto:${email}`, accent: "bg-sky-50 text-sky-600" },
    {
      icon: MapPin,
      title: "Visit",
      value: `${address}, ${city}`,
      href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      accent: "bg-amber-50 text-amber-600",
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-red-700 pb-28 pt-14 lg:pb-32 lg:pt-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-red-900/30 blur-3xl" />
          <MessageCircle className="absolute right-[8%] top-1/2 hidden h-28 w-28 -translate-y-1/2 text-white/10 md:block" />
          <Mail className="absolute left-[7%] top-1/3 hidden h-16 w-16 text-white/10 md:block" />
        </div>
        <div className="container relative mx-auto px-4 text-center lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            We&apos;re here to help
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Let&apos;s Talk
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Questions about donating, a blood requirement, or want to organise a donation camp at your
            company? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Quick actions */}
      <section className="relative z-10 -mt-16 lg:-mt-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {quickActions.map(({ icon: Icon, title, value, href, accent, external }) => (
              <a
                key={title}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-lg shadow-gray-200/60 transition-all hover:-translate-y-1 hover:shadow-xl sm:p-6"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${accent} transition-transform group-hover:scale-110`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="mt-3 font-semibold text-gray-900">{title}</span>
                <span className="mt-0.5 w-full truncate text-sm text-gray-600 group-hover:text-primary">{value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
              <p className="mb-6 mt-1 text-sm text-gray-500">Pick a topic and we&apos;ll route it to the right volunteer.</p>
              <ContactForm />
            </div>

            <aside className="space-y-5">
              {/* Emergency */}
              <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-6 text-white shadow-lg shadow-red-600/20">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Siren className="h-5 w-5" aria-hidden="true" />
                  Urgent blood need?
                </h2>
                <p className="mt-1 text-sm text-white/85">
                  Don&apos;t use this form — call us now or send an urgent request.
                </p>
                <div className="mt-4 grid gap-2">
                  <a
                    href={`tel:${phoneTel}`}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-red-700 transition-colors hover:bg-white/90"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {phone}
                  </a>
                  <Link
                    href="/request-blood"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
                  >
                    Request Blood
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Map + address */}
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <iframe
                  title={`Map of ${fullAddress}`}
                  src={`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`}
                  className="h-52 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="space-y-4 p-6">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-gray-900">Infopark IT Unit</p>
                      <p className="text-sm text-gray-600">{fullAddress}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-gray-900">Office hours</p>
                      <p className="text-sm text-gray-600">Mon – Sat: 9:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 transition-colors hover:border-primary hover:text-primary"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Get directions
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Quick answers</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
                Frequently asked <span className="text-primary">questions</span>
              </h2>
            </div>
            <div className="mt-10 space-y-3">
              {faqs.map(({ q, a }, i) => (
                <details
                  key={q}
                  open={i === 0}
                  className="group rounded-2xl border border-gray-200 bg-white transition-colors open:border-primary/30 open:bg-rose-50/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-gray-700">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
