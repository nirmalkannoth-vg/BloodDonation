import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedContent } from "@/services/public";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Droplet,
  FlaskConical,
  Heart,
  HeartPulse,
  Lightbulb,
  Megaphone,
  Quote,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Health Awareness",
  description:
    "Learn how blood donation works, how to prepare, common myths and facts, and health updates from Blood Connect – InfoPark News Initiate, Kochi.",
};

export const dynamic = "force-dynamic";

const PHOTOS = {
  hero: "/images/awareness/blood-bags-types.jpg",
  heroSmall: "/images/awareness/blood-tubes-lab.jpg",
  before: "/images/awareness/gloved-hands-sample.jpg",
  during: "/images/awareness/donor-arm-blood-bags.jpg",
  after: "/images/awareness/blood-bag.jpg",
  myths: "/images/awareness/blood-vials-rack.jpg",
  cta: "/images/awareness/blood-tubes-lab.jpg",
};

/* -------------------------------------------------------------------------- */
/* Static awareness content                                                   */
/* -------------------------------------------------------------------------- */

const facts = [
  { icon: Heart, value: "Up to 3", label: "lives can be helped by a single donation" },
  { icon: Clock, value: "~10 min", label: "is all it takes to actually draw the blood" },
  { icon: HeartPulse, value: "24 hrs", label: "for your body to replace the lost fluid" },
  { icon: FlaskConical, value: "0", label: "lab substitutes — blood only comes from donors" },
];

const journey = [
  {
    step: "Before",
    title: "Prepare well",
    photo: PHOTOS.before,
    alt: "Gloved hands holding a blood sample tube for a health check",
    tips: [
      "Eat a healthy, iron-rich meal",
      "Drink plenty of water",
      "Get a good night's sleep",
      "Avoid alcohol for 24 hours",
      "Carry a photo ID",
    ],
  },
  {
    step: "During",
    title: "Relax — it's quick",
    photo: PHOTOS.during,
    alt: "A donor's arm connected to blood collection bags during donation",
    tips: [
      "Wear sleeves that roll up easily",
      "A quick health check comes first",
      "Only a brief pinch from the needle",
      "Squeeze the ball gently and breathe",
      "Tell the staff if you feel unwell",
    ],
  },
  {
    step: "After",
    title: "Rest & recover",
    photo: PHOTOS.after,
    alt: "A donated blood bag ready to help a patient",
    tips: [
      "Rest 10–15 minutes and have a snack",
      "Drink extra fluids for the day",
      "Skip heavy lifting and workouts today",
      "Keep the bandage on for a few hours",
      "Feeling dizzy? Lie down, legs raised",
    ],
  },
];

const myths = [
  {
    myth: "Donating blood makes you weak.",
    fact: "A healthy body replaces the lost fluid within about a day. Most donors carry on with normal activities the same day — just avoid strenuous exercise.",
  },
  {
    myth: "It's very painful.",
    fact: "You'll feel a brief pinch when the needle goes in. Most donors say it's far easier than they expected.",
  },
  {
    myth: "I could catch an infection by donating.",
    fact: "Every donation uses a new, sterile, single-use needle and kit. There is no risk of infection from donating.",
  },
  {
    myth: "My blood type is common, so it isn't needed.",
    fact: "Every blood group is needed every day. Common groups are needed most because more patients have them.",
  },
  {
    myth: "Vegetarians or women can't donate.",
    fact: "Anyone healthy who meets the age, weight and haemoglobin requirements can donate — your haemoglobin is checked before every donation.",
  },
];

const checkFirst = [
  "Have a fever, cold or infection",
  "Recently got a tattoo or piercing",
  "Are pregnant or breastfeeding",
  "Had surgery or are on antibiotics",
  "Take regular medication",
];

/* -------------------------------------------------------------------------- */
/* CMS content config                                                         */
/* -------------------------------------------------------------------------- */

const categories: { value: string; label: string; icon: LucideIcon; badge: string }[] = [
  { value: "DOCTOR_MESSAGE", label: "Doctor's Message", icon: Stethoscope, badge: "bg-blue-50 text-blue-700" },
  { value: "BLOOD_DONATION", label: "Blood Donation", icon: Droplet, badge: "bg-red-50 text-red-700" },
  { value: "HEALTHCARE", label: "Healthcare", icon: Heart, badge: "bg-emerald-50 text-emerald-700" },
  { value: "AWARENESS", label: "Awareness", icon: Lightbulb, badge: "bg-amber-50 text-amber-700" },
  { value: "QUOTE", label: "Quotes", icon: Quote, badge: "bg-violet-50 text-violet-700" },
  { value: "ANNOUNCEMENT", label: "Announcements", icon: Megaphone, badge: "bg-orange-50 text-orange-700" },
];
const categoryByValue = Object.fromEntries(categories.map((c) => [c.value, c]));

function SectionTitle({ eyebrow, title, accent, text }: { eyebrow: string; title: string; accent: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
        {title} <span className="text-primary">{accent}</span>
      </h2>
      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  );
}

export default async function HealthAwarenessPage() {
  const content = await getPublishedContent();

  const byCategory: Record<string, typeof content> = { all: content };
  for (const item of content) {
    (byCategory[item.category] ??= []).push(item);
  }
  const tabs = [
    { value: "all", label: "All", icon: Heart },
    ...categories.filter((c) => byCategory[c.value]?.length),
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-red-700">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 right-1/3 h-96 w-96 rounded-full bg-red-900/30 blur-3xl" />
        </div>

        <div className="container relative mx-auto grid items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:gap-16 lg:px-6 lg:py-20">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25">
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              Learn · Prepare · Donate
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Health Awareness
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85 lg:mx-0">
              Everything you need to know about giving blood — how to prepare, what to expect, and the
              truth behind common myths.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {[
                { href: "#journey", label: "Donation journey" },
                { href: "#myths", label: "Myths & facts" },
                ...(content.length ? [{ href: "#updates", label: "Latest updates" }] : []),
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white hover:text-red-700"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Photo collage */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-red-950/30 ring-4 ring-white/20">
              <Image
                src={PHOTOS.hero}
                alt="Donated blood bags labelled with blood groups A, B and O"
                fill
                preload
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-40 overflow-hidden rounded-2xl shadow-xl ring-4 ring-white sm:block lg:-left-10 lg:w-48">
              <div className="relative aspect-square">
                <Image src={PHOTOS.heroSmall} alt="Blood sample tubes in a lab rack" fill sizes="200px" className="object-cover" />
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-2xl bg-white/95 py-2.5 pl-2.5 pr-4 shadow-xl backdrop-blur">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <Droplet className="h-5 w-5" fill="currentColor" aria-hidden="true" />
              </span>
              <p className="text-sm leading-tight text-gray-600">
                <span className="block font-bold text-gray-900">1 donation</span>
                saves up to <span className="font-semibold text-primary">3 lives</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- Did you know ----------------------------- */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle eyebrow="Did you know?" title="Blood donation" accent="by the numbers" />
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {facts.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-3xl bg-gradient-to-br from-rose-50 to-white p-5 ring-1 ring-rose-100 transition-shadow hover:shadow-lg sm:p-6"
              >
                <Icon className="h-8 w-8 text-primary" strokeWidth={1.75} aria-hidden="true" />
                <p className="mt-4 font-display text-4xl font-bold leading-none text-primary lg:text-5xl">{value}</p>
                <p className="mt-2 text-sm text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Journey ------------------------------ */}
      <section id="journey" className="scroll-mt-20 bg-gray-50 py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle
            eyebrow="Your donation journey"
            title="Before, during"
            accent="& after"
            text="Simple steps that make your donation smooth, safe and comfortable."
          />
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
            {journey.map(({ step, title, photo, alt, tips }, i) => (
              <article
                key={step}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={photo}
                    alt={alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow">
                    {i + 1} · {step}
                  </span>
                  <h3 className="absolute bottom-4 left-5 text-2xl font-bold text-white">{title}</h3>
                </div>
                <ul className="space-y-2.5 p-6">
                  {tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- Myths & facts --------------------------- */}
      <section id="myths" className="scroll-mt-20 bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Myths & facts</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
                Don&apos;t let a myth <span className="text-primary">stop a life-saver</span>
              </h2>
              <p className="mt-3 text-gray-600">Tap a myth to see the facts.</p>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={PHOTOS.myths}
                  alt="Tested blood sample tubes in a laboratory rack"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
                  <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-600" aria-hidden="true" />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">Safe & sterile.</span> A new single-use kit
                    is used for every donor.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {myths.map(({ myth, fact }, i) => (
                <details
                  key={myth}
                  open={i === 0}
                  className="group rounded-2xl border border-gray-200 bg-white transition-colors open:border-primary/30 open:bg-rose-50/40"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <X className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-red-500">Myth</span>
                      <span className="block font-semibold text-gray-900">{myth}</span>
                    </span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="flex gap-4 px-5 pb-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm leading-relaxed text-gray-700">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-600">Fact</span>
                      {fact}
                    </p>
                  </div>
                </details>
              ))}

              {/* Check with staff first */}
              <div className="mt-6 rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100">
                <h3 className="flex items-center gap-2 font-semibold text-amber-900">
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  Talk to the medical staff first if you…
                </h3>
                <ul className="mt-3 grid gap-2 text-sm text-amber-900/80 sm:grid-cols-2">
                  {checkFirst.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ Updates from the CMS ------------------------ */}
      {content.length > 0 && (
        <section id="updates" className="scroll-mt-20 bg-gray-50 py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <SectionTitle
              eyebrow="From our team"
              title="Latest"
              accent="updates"
              text="Health tips, doctor's messages and announcements from Blood Connect."
            />

            <Tabs defaultValue="all" className="mx-auto mt-10 max-w-6xl">
              <TabsList className="mx-auto mb-8 flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
                {tabs.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="h-9 flex-none rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 data-active:border-primary data-active:bg-primary data-active:text-white"
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((cat) => (
                <TabsContent key={cat.value} value={cat.value}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {(byCategory[cat.value] ?? []).map((item) => {
                      const meta = categoryByValue[item.category];
                      const Icon = meta?.icon ?? Heart;
                      const isQuote = item.category === "QUOTE";
                      return (
                        <article
                          key={item.id}
                          className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-xl"
                        >
                          {item.imageUrl ? (
                            <div className="relative aspect-video bg-gray-100">
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                unoptimized
                                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex aspect-[3/1] items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100/60">
                              <Icon className="h-10 w-10 text-primary/60" strokeWidth={1.5} aria-hidden="true" />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col p-6">
                            <span
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta?.badge ?? "bg-gray-100 text-gray-700"}`}
                            >
                              <Icon className="h-3 w-3" aria-hidden="true" />
                              {meta?.label ?? item.category}
                            </span>
                            <h3 className={`mt-3 font-semibold text-gray-900 ${isQuote ? "text-lg italic" : ""}`}>
                              {isQuote ? `“${item.title}”` : item.title}
                            </h3>
                            {item.description && (
                              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-gray-600">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      )}

      {/* -------------------------------- CTA -------------------------------- */}
      <section className="relative overflow-hidden">
        <Image src={PHOTOS.cta} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-700/90 to-red-700/70" />
        <div className="container relative mx-auto px-4 py-16 text-center lg:px-6 lg:py-20">
          <Users className="mx-auto h-10 w-10 text-white/80" aria-hidden="true" />
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-wide text-white lg:text-5xl">
            Ready to save a life?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/90">
            Register as a donor in 2 minutes — we&apos;ll reach out only when your blood group is needed.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl bg-white px-6 text-base font-semibold text-red-700 hover:bg-white/90">
              <Link href="/donate">
                <Droplet className="h-5 w-5" fill="currentColor" />
                Become a Donor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/60 bg-transparent px-6 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/request-blood">Request Blood</Link>
            </Button>
          </div>
        </div>
      </section>

      <p className="container mx-auto px-4 py-6 text-center text-xs text-gray-500 lg:px-6">
        This information is for general awareness only and is not medical advice. Final donation eligibility is
        determined by qualified healthcare professionals.
      </p>
    </div>
  );
}
