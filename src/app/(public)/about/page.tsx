import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllSettings } from "@/services/public";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookHeart,
  Building2,
  CalendarHeart,
  Droplet,
  Eye,
  Handshake,
  Heart,
  HeartHandshake,
  Hospital,
  Laptop,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Blood Connect is an initiative of the Infopark IT Unit, Kochi. Since 2020 we have been organising blood donation drives and connecting donors with patients in need.",
};

export const dynamic = "force-dynamic";

/** Year the Infopark IT Unit started its blood donation work. */
const FOUNDED_YEAR = 2020;

const PHOTOS = {
  heroMain: "/images/awareness/donor-arm-blood-bags.jpg",
  heroSmall: "/images/awareness/gloved-hands-sample.jpg",
  mission: "/images/awareness/blood-bags-types.jpg",
  cta: "/images/awareness/blood-vials-rack.jpg",
};

const whatWeDo = [
  { icon: Users, title: "Donor network", text: "A growing list of verified, willing donors across InfoPark and Kochi." },
  { icon: Search, title: "Matching requests", text: "We find compatible donors quickly when a patient needs blood." },
  { icon: CalendarHeart, title: "Donation camps", text: "Regular blood donation drives at InfoPark and partner campuses." },
  { icon: Megaphone, title: "Awareness", text: "Busting myths and encouraging first-time donors to step up." },
  { icon: Hospital, title: "Hospital partners", text: "Working with hospitals and blood banks to coordinate donations." },
  { icon: HeartHandshake, title: "Donor care", text: "Supporting and appreciating every donor in our community." },
];

const values = [
  { icon: Heart, title: "Compassion", text: "Every request is a real person and a family waiting." },
  { icon: Handshake, title: "Community", text: "Colleagues helping strangers — that's who we are." },
  { icon: ShieldCheck, title: "Trust & privacy", text: "Donor details are never shown publicly." },
  { icon: Sparkles, title: "Simplicity", text: "Registering or requesting blood takes minutes." },
];

export default async function AboutPage() {
  const settings = await getAllSettings();
  const ngoName = settings.NGO_NAME || "Blood Connect";
  const yearsActive = Math.max(1, new Date().getFullYear() - FOUNDED_YEAR);

  const story = [
    {
      year: String(FOUNDED_YEAR),
      icon: Laptop,
      title: "It started at InfoPark",
      text: "A group of IT employees at InfoPark, Kochi came together to organise blood donation drives and answer urgent blood requests.",
    },
    {
      year: "Growing",
      icon: Building2,
      title: "More colleagues joined",
      text: "Employees from companies across InfoPark joined in, building a dependable network of donors and volunteers.",
    },
    {
      year: "Today",
      icon: Droplet,
      title: `${ngoName} goes online`,
      text: "Anyone can now register as a donor or request blood in minutes, and our team coordinates the rest.",
    },
  ];

  const stats = [
    { value: `Since ${FOUNDED_YEAR}`, label: `${yearsActive}+ years of service` },
    { value: "500+", label: "Registered donors" },
    { value: "200+", label: "Lives touched" },
    { value: "50+", label: "Partner hospitals" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-red-700">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 right-1/3 h-96 w-96 rounded-full bg-red-900/30 blur-3xl" />
        </div>

        <div className="container relative mx-auto grid items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:gap-16 lg:px-6 lg:py-20">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25">
              <Laptop className="h-4 w-4" aria-hidden="true" />
              An initiative of the Infopark IT Unit
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              About {ngoName}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/90 lg:mx-0">
              {ngoName} is run by the <strong className="text-white">Infopark IT Unit</strong>, Kochi.
              Since <strong className="text-white">{FOUNDED_YEAR}</strong>, our volunteers have been organising
              blood donation drives and connecting donors with patients who need them.
            </p>
            <p className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-white/95">
              By IT employees. For everyone.
            </p>
          </div>

          {/* Photo collage */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-red-950/30 ring-4 ring-white/20">
              <Image
                src={PHOTOS.heroMain}
                alt="A donor's arm connected to blood collection bags during donation"
                fill
                preload
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-44 overflow-hidden rounded-2xl shadow-xl ring-4 ring-white sm:block lg:-left-10 lg:w-52">
              <div className="relative aspect-[4/3]">
                <Image src={PHOTOS.heroSmall} alt="Gloved hands holding a blood sample tube" fill sizes="220px" className="object-cover" />
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-2xl bg-white/95 py-2.5 pl-2.5 pr-4 shadow-xl backdrop-blur">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
              </span>
              <p className="text-sm leading-tight text-gray-600">
                <span className="block font-bold text-gray-900">Since {FOUNDED_YEAR}</span>
                saving lives in Kochi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- Stats ------------------------------- */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-gray-100 py-10 lg:grid-cols-4 lg:divide-x">
            {stats.map(({ value, label }) => (
              <div key={label} className="px-4 py-4 text-center">
                <p className="font-display text-4xl font-bold leading-none text-primary lg:text-5xl">{value}</p>
                <p className="mt-2 text-sm text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- Story ------------------------------- */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our story</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              From colleagues to a <span className="text-primary">life-saving community</span>
            </h2>
          </div>

          <ol className="relative mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-6">
            {/* Connector line */}
            <div className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-red-200 md:block" aria-hidden="true" />
            {story.map(({ year, icon: Icon, title, text }) => (
              <li key={title} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 ring-8 ring-gray-50">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="mt-5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-red-100">
                  {year}
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------- Mission & vision -------------------------- */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src={PHOTOS.mission}
                  alt="Donated blood bags labelled with blood groups A, B and O"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 right-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:right-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                  <Droplet className="h-5 w-5 text-primary" fill="currentColor" aria-hidden="true" />
                </span>
                <p className="text-sm text-gray-700">
                  <span className="block font-bold text-gray-900">1 donation</span>
                  can help up to 3 lives
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Why we exist</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
                  No one should wait for blood
                </h2>
              </div>
              {[
                {
                  icon: Target,
                  title: "Our mission",
                  text: "To make sure no patient loses their life because blood couldn't be found in time — by building a ready network of donors and coordinating every request with care.",
                },
                {
                  icon: Eye,
                  title: "Our vision",
                  text: "A Kochi where every workplace has willing donors, every family knows who to call, and donating blood is a normal, proud habit.",
                },
                {
                  icon: BookHeart,
                  title: "Our promise",
                  text: "We are volunteers working for the community. We treat every request with urgency and everyone's details with respect.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-2xl p-4 transition-colors hover:bg-rose-50/60">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- What we do ----------------------------- */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">What we do</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              How we <span className="text-primary">help</span>
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whatWeDo.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- Values ------------------------------- */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our values</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              What <span className="text-primary">guides us</span>
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl bg-gradient-to-br from-rose-50 to-white p-6 text-center ring-1 ring-rose-100">
                <Icon className="mx-auto h-8 w-8 text-primary" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="mt-3 font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- CTA -------------------------------- */}
      <section className="relative overflow-hidden">
        <Image src={PHOTOS.cta} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-700/90 to-red-700/75" />
        <div className="container relative mx-auto px-4 py-16 text-center lg:px-6 lg:py-20">
          <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-white lg:text-5xl">
            Join the InfoPark life-savers
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/90">
            Whether you work at InfoPark or anywhere in Kochi — become a donor, or volunteer with us.
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
              <Link href="/contact">Volunteer with us</Link>
            </Button>
          </div>
        </div>
      </section>

      <p className="container mx-auto px-4 py-6 text-center text-xs text-gray-500 lg:px-6">
        {ngoName} facilitates connections between blood donors and recipients. Final medical eligibility for
        donation and transfusion is determined by qualified healthcare professionals.
      </p>
    </div>
  );
}
