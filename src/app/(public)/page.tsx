import { existsSync } from "node:fs";
import path from "node:path";
import { Metadata } from "next";
import {
  HeroSection,
  ImpactStatsSection,
  HowItWorksSection,
  CTASection,
  HERO_IMAGE_SRC,
} from "@/components/public/hero-section";
import { BloodAvailabilitySection } from "@/components/public/blood-availability";
import { getPublicBloodAvailability } from "@/services/public";

export const metadata: Metadata = {
  title: "Blood Connect - Donate Blood, Save Lives",
  description:
    "Join Blood Connect – InfoPark News Initiate, Kochi in our mission to save lives through blood donation. Register as a donor, request blood, and learn about the importance of blood donation.",
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const availability = await getPublicBloodAvailability();
  // Show the hero photo once it has been added to /public; otherwise fall back to SVG art
  const hasHeroImage = existsSync(path.join(process.cwd(), "public", HERO_IMAGE_SRC));

  return (
    <>
      <HeroSection hasHeroImage={hasHeroImage} />
      <BloodAvailabilitySection availability={availability} />
      <ImpactStatsSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
