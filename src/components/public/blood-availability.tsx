import Link from "next/link";
import { ArrowRight, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BloodAvailability } from "@/types";
import { SectionHeading } from "./hero-section";

interface BloodAvailabilityProps {
  availability: BloodAvailability;
}

// A = rose, B = blue, O = green, AB = violet
const bloodGroupColors: Record<string, string> = {
  "A+": "bg-rose-50/70 border-rose-100",
  "A-": "bg-rose-50/70 border-rose-100",
  "B+": "bg-sky-50/80 border-sky-100",
  "B-": "bg-sky-50/80 border-sky-100",
  "O+": "bg-emerald-50/70 border-emerald-100",
  "O-": "bg-emerald-50/70 border-emerald-100",
  "AB+": "bg-violet-50/70 border-violet-100",
  "AB-": "bg-violet-50/70 border-violet-100",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function BloodAvailabilitySection({ availability }: BloodAvailabilityProps) {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-10 text-center">
          <Droplet className="mx-auto mb-1 h-5 w-5 text-primary" fill="currentColor" aria-hidden="true" />
          <SectionHeading lead="Blood" accent="Availability" />
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-700 lg:text-base">
            Current registered eligible donors by blood group. Connect with our team to find a
            matching donor for your needs.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-4">
          {bloodGroups.map((group) => (
            <div
              key={group}
              className={`${bloodGroupColors[group]} rounded-xl border px-3 py-5 text-center shadow-sm transition-shadow hover:shadow-md`}
            >
              <Droplet className="mx-auto h-5 w-5 text-primary" fill="currentColor" aria-hidden="true" />
              <p className="mt-3 text-xl font-bold text-gray-900">{group}</p>
              <p className="mt-1 text-3xl font-bold text-primary">{availability[group] ?? 0}</p>
              <p className="mt-2 text-xs text-gray-600">Available Donors</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild className="h-10 rounded-full px-6 font-semibold">
            <Link href="/request-blood">
              Find a Donor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <p className="mx-auto mt-4 max-w-2xl text-xs text-gray-500">
            Availability is based on registered donor information and does not replace medical
            screening or confirmation by healthcare providers.
          </p>
        </div>
      </div>
    </section>
  );
}
