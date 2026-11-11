"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, isAfter, parseISO, startOfDay } from "date-fns";
import { donorRegistrationSchema, type DonorRegistrationInput } from "@/lib/validations/donor";
import { registerDonor } from "@/actions/donor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  BloodGroupPicker,
  Field,
  FieldError,
  FormProgressHeader,
  FormSection,
  ItEmployeePicker,
  PhonePrefix,
  digitsOnlyPhone,
  inputClass,
  isValidPhone,
  type BloodGroupOption,
} from "./form-parts";
import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Droplet,
  HeartHandshake,
  Loader2,
  Lock,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface DonorRegistrationFormProps {
  bloodGroups: BloodGroupOption[];
  /** Days a donor must wait between donations (Admin → Settings). */
  eligibilityIntervalDays?: number;
}

export function DonorRegistrationForm({
  bloodGroups,
  eligibilityIntervalDays = 90,
}: DonorRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [neverDonated, setNeverDonated] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DonorRegistrationInput>({
    resolver: zodResolver(donorRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      lastDonationDate: "",
      companyName: "",
      consentToContact: false,
      isItEmployee: true,
    },
  });

  const values = watch();
  const phoneField = register("phone");

  // Progress across the parts the user must fill in (IT employee is pre-selected)
  const sections = {
    personal:
      !!values.firstName?.trim() &&
      !!values.lastName?.trim() &&
      Number.isFinite(values.age) &&
      isValidPhone(values.phone),
    blood: !!values.bloodGroupId && !!values.lastDonationDate,
    consent: values.consentToContact === true,
  };
  const completed = Object.values(sections).filter(Boolean).length;

  // Live "when can I donate next?" hint
  let eligibility: { date: string; now: boolean } | null = null;
  if (values.lastDonationDate) {
    const last = parseISO(values.lastDonationDate);
    if (!Number.isNaN(last.getTime())) {
      const next = addDays(last, eligibilityIntervalDays);
      eligibility = {
        date: format(next, "d MMM yyyy"),
        now: !isAfter(startOfDay(next), startOfDay(new Date())),
      };
    }
  }

  const toggleNeverDonated = () => {
    const next = !neverDonated;
    setNeverDonated(next);
    setValue("lastDonationDate", next ? format(new Date(), "yyyy-MM-dd") : "", {
      shouldValidate: next,
    });
  };

  const scrollToTop = () =>
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );

  const onSubmit = async (data: DonorRegistrationInput) => {
    setIsSubmitting(true);
    try {
      const result = await registerDonor(data);
      if (result.success) {
        setSubmittedName(data.firstName.trim());
        toast.success("Registration successful! We will contact you soon.");
        scrollToTop();
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------ Success view ------------------------------ */

  if (submittedName !== null) {
    return (
      <div
        ref={topRef}
        className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60"
      >
        <div className="bg-gradient-to-br from-emerald-50 to-white px-6 pb-8 pt-12 text-center sm:px-10">
          <div className="relative mx-auto mb-6 h-20 w-20">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-60" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-gray-900">
            Thank you, {submittedName}!
          </h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            You&apos;re now part of our life-saving community. Your registration has been received.
          </p>
        </div>

        <div className="px-6 pb-10 sm:px-10">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            What happens next
          </h3>
          <ol className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Our team verifies your details." },
              { icon: PhoneCall, text: "We call you when a patient needs your blood group." },
              { icon: HeartHandshake, text: "You donate at the hospital or blood bank and save a life." },
            ].map(({ icon: Icon, text }, i) => (
              <li key={text} className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-gray-700">
                  <span className="font-semibold text-gray-900">{i + 1}.</span> {text}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 flex-1 rounded-xl text-base font-semibold">
              <Link href="/">
                Back to Home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="h-12 flex-1 rounded-xl text-base font-semibold"
              onClick={() => {
                reset();
                setNeverDonated(false);
                setSubmittedName(null);
                scrollToTop();
              }}
            >
              Register another donor
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- Form view ------------------------------- */

  return (
    <div
      ref={topRef}
      className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60"
    >
      <FormProgressHeader
        title="Donor Registration"
        subtitle="Takes about 2 minutes. Only Company Name is optional."
        completed={completed}
        total={3}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10 px-6 py-8 sm:px-8">
        {/* 1. Personal */}
        <FormSection
          step={1}
          icon={User}
          title="About you"
          description="So we know who to contact."
          done={sections.personal}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
              <Input
                id="firstName"
                autoComplete="given-name"
                placeholder="e.g. Arjun"
                aria-invalid={!!errors.firstName}
                className={inputClass}
                {...register("firstName")}
              />
            </Field>

            <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
              <Input
                id="lastName"
                autoComplete="family-name"
                placeholder="e.g. Lal"
                aria-invalid={!!errors.lastName}
                className={inputClass}
                {...register("lastName")}
              />
            </Field>

            <Field
              label="Age"
              htmlFor="age"
              error={errors.age?.message}
              hint={<p className="text-xs text-gray-500">Donors must be 18–65 years old.</p>}
            >
              <Input
                id="age"
                type="number"
                inputMode="numeric"
                min={18}
                max={65}
                placeholder="e.g. 28"
                aria-invalid={!!errors.age}
                className={inputClass}
                {...register("age", { valueAsNumber: true })}
              />
            </Field>

            <Field
              label="Mobile number"
              htmlFor="phone"
              error={errors.phone?.message}
              hint={<p className="text-xs text-gray-500">We&apos;ll only call when your blood is needed.</p>}
            >
              <div className="relative">
                <PhonePrefix />
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  aria-invalid={!!errors.phone}
                  className={cn(inputClass, "pl-16 tracking-wide")}
                  {...phoneField}
                  onChange={digitsOnlyPhone(phoneField.onChange)}
                />
              </div>
            </Field>
          </div>
        </FormSection>

        {/* 2. Blood */}
        <FormSection
          step={2}
          icon={Droplet}
          title="Blood details"
          description="Helps us match you with patients who need your blood group."
          done={sections.blood}
        >
          <Field label="Blood group" error={errors.bloodGroupId?.message}>
            <BloodGroupPicker
              bloodGroups={bloodGroups}
              value={values.bloodGroupId}
              onChange={(id) => setValue("bloodGroupId", id, { shouldValidate: true })}
            />
          </Field>

          <Field label="Last donation date" htmlFor="lastDonationDate" error={errors.lastDonationDate?.message}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                id="lastDonationDate"
                type="date"
                readOnly={neverDonated}
                aria-invalid={!!errors.lastDonationDate}
                className={cn(inputClass, "sm:max-w-[240px]", neverDonated && "bg-gray-50 text-gray-500")}
                {...register("lastDonationDate")}
              />
              <button
                type="button"
                aria-pressed={neverDonated}
                onClick={toggleNeverDonated}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium transition-colors",
                  neverDonated
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-dashed border-gray-300 text-gray-600 hover:border-primary/50 hover:text-primary"
                )}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {neverDonated ? "First-time donor ✓" : "I've never donated"}
              </button>
            </div>
          </Field>

          {eligibility && !errors.lastDonationDate && (
            <div
              className={cn(
                "flex items-start gap-3 rounded-xl px-4 py-3 text-sm",
                eligibility.now ? "bg-emerald-50 text-emerald-800" : "bg-sky-50 text-sky-800"
              )}
            >
              <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                {eligibility.now ? (
                  <>
                    <span className="font-semibold">Great, you can donate right away!</span> It&apos;s been
                    more than {eligibilityIntervalDays} days since your last donation.
                  </>
                ) : (
                  <>
                    You&apos;ll be eligible to donate from{" "}
                    <span className="font-semibold">{eligibility.date}</span> ({eligibilityIntervalDays} days
                    after your last donation).
                  </>
                )}
              </p>
            </div>
          )}
        </FormSection>

        {/* 3. Work */}
        <FormSection
          step={3}
          icon={Briefcase}
          title="Work details"
          description="We mostly coordinate donations within the InfoPark community."
        >
          <Field label="Are you an IT employee?" error={errors.isItEmployee?.message}>
            <ItEmployeePicker
              value={values.isItEmployee}
              onChange={(v) => setValue("isItEmployee", v, { shouldValidate: true })}
            />
          </Field>

          <Field label="Company name" htmlFor="companyName" optional error={errors.companyName?.message}>
            <Input
              id="companyName"
              autoComplete="organization"
              placeholder="e.g. TCS, UST, IBS…"
              aria-invalid={!!errors.companyName}
              className={inputClass}
              {...register("companyName")}
            />
          </Field>
        </FormSection>

        {/* Consent */}
        <div className="space-y-2">
          <div
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 p-4 transition-colors",
              values.consentToContact
                ? "border-primary/40 bg-rose-50/60"
                : errors.consentToContact
                  ? "border-red-300 bg-red-50/40"
                  : "border-gray-200 bg-gray-50"
            )}
          >
            <Checkbox
              id="consentToContact"
              className="mt-0.5 size-5"
              checked={values.consentToContact}
              aria-invalid={!!errors.consentToContact}
              onCheckedChange={(checked) =>
                setValue("consentToContact", checked === true, { shouldValidate: true })
              }
            />
            <div className="space-y-1">
              <Label htmlFor="consentToContact" className="cursor-pointer font-semibold text-gray-900">
                Yes, I&apos;m willing to donate blood
              </Label>
              <p className="text-sm text-gray-600">
                You agree to be contacted when there&apos;s a blood requirement matching your profile.
              </p>
            </div>
          </div>
          <FieldError message={errors.consentToContact?.message} />
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-13 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/25"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Registering…
              </>
            ) : (
              <>
                <Droplet className="h-5 w-5" fill="currentColor" />
                Register as Donor
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Your details are private and never shown on the public website.
          </p>
        </div>
      </form>
    </div>
  );
}
