"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bloodRequestSchema, type BloodRequestInput } from "@/lib/validations/blood-request";
import { submitBloodRequest } from "@/actions/blood-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Copy,
  Droplet,
  Loader2,
  Lock,
  Phone,
  Send,
  Share2,
  Siren,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface BloodRequestFormProps {
  bloodGroups: BloodGroupOption[];
  contactPhone?: string;
}

/** One-tap starters for the "reason" field. */
const REASONS = [
  "Surgery",
  "Accident / Trauma",
  "Pregnancy / Delivery",
  "Cancer treatment",
  "Dengue / Low platelets",
  "Thalassemia",
  "Anaemia",
  "Dialysis",
];

const REASON_MAX = 500;

interface Submitted {
  referenceNumber: string;
  bloodGroup: string;
  urgent: boolean;
}

export function BloodRequestForm({ bloodGroups, contactPhone = "+91 1234567890" }: BloodRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const contactPhoneTel = contactPhone.replace(/[^\d+]/g, "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BloodRequestInput>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      companyName: "",
      reason: "",
      willToDonate: false,
      isItEmployee: true,
      isUrgent: false,
    },
  });

  const values = watch();
  const phoneField = register("phone");
  const reason = values.reason ?? "";

  const sections = {
    need: !!values.bloodGroupId,
    reason: reason.trim().length > 0,
    details:
      !!values.firstName?.trim() &&
      !!values.lastName?.trim() &&
      Number.isFinite(values.age) &&
      isValidPhone(values.phone),
    consent: values.willToDonate === true,
  };
  const completed = Object.values(sections).filter(Boolean).length;

  const pickReason = (chip: string) => {
    const current = reason.trim();
    // Replace an untouched chip; otherwise put the chip in front of what the user typed
    const next =
      !current || REASONS.includes(current)
        ? chip
        : current.startsWith(chip)
          ? current
          : `${chip} – ${current}`;
    setValue("reason", next.slice(0, REASON_MAX), { shouldValidate: true });
  };

  const scrollToTop = () =>
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );

  const onSubmit = async (data: BloodRequestInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitBloodRequest(data);
      if (result.success && result.referenceNumber) {
        setSubmitted({
          referenceNumber: result.referenceNumber,
          bloodGroup: bloodGroups.find((b) => b.id === data.bloodGroupId)?.displayName ?? "",
          urgent: data.isUrgent === true,
        });
        toast.success("Blood request submitted successfully!");
        scrollToTop();
      } else {
        toast.error(result.error || "Failed to submit request");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------ Success view ------------------------------ */

  if (submitted) {
    const copyReference = async () => {
      try {
        await navigator.clipboard.writeText(submitted.referenceNumber);
        toast.success("Reference number copied!");
      } catch {
        toast.error("Couldn't copy — please note it down.");
      }
    };

    const shareText = `${submitted.urgent ? "URGENT: " : ""}${submitted.bloodGroup} blood needed. Request ref ${submitted.referenceNumber} with Blood Connect – InfoPark News Initiate, Kochi. If you can donate, please call ${contactPhone}.`;

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
            Request received
          </h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            Our team is looking for a matching{" "}
            <span className="font-semibold text-primary">{submitted.bloodGroup}</span> donor and will call
            you shortly. Please keep your phone reachable.
          </p>
        </div>

        <div className="space-y-6 px-6 pb-10 sm:px-10">
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Your reference number
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <p className="font-mono text-2xl font-bold tracking-wider text-primary sm:text-3xl">
                {submitted.referenceNumber}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={copyReference}
                aria-label="Copy reference number"
                className="h-9 w-9 rounded-full"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Mention this number when you call us.</p>
          </div>

          {submitted.urgent && (
            <div className="flex flex-col items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center">
              <Siren className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <p className="flex-1">Marked as <strong>urgent</strong>. For faster help, call us right now.</p>
              <Button asChild size="sm" className="rounded-lg">
                <a href={`tel:${contactPhoneTel}`}>
                  <Phone className="h-4 w-4" />
                  Call now
                </a>
              </Button>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-[#25D366] text-base font-semibold text-white hover:bg-[#1fb857]"
            >
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Share2 className="h-4 w-4" />
                Share on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl text-base font-semibold">
              <a href={`tel:${contactPhoneTel}`}>
                <Phone className="h-4 w-4" />
                Call {contactPhone}
              </a>
            </Button>
          </div>
          <p className="-mt-3 text-center text-xs text-gray-500">
            Sharing with friends and family helps find a donor faster.
          </p>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
            <Button asChild variant="ghost" className="h-11 flex-1 rounded-xl font-semibold">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 flex-1 rounded-xl font-semibold"
              onClick={() => {
                reset();
                setSubmitted(null);
                scrollToTop();
              }}
            >
              Submit another request
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
      id="request-form"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60"
    >
      <FormProgressHeader
        title="Blood Request"
        subtitle="3 quick steps. We'll call you back to arrange donors."
        completed={completed}
        total={4}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10 px-6 py-8 sm:px-8">
        {/* 1. What is needed */}
        <FormSection
          step={1}
          icon={Droplet}
          title="What blood is needed?"
          description="Pick the patient's blood group and how soon it's needed."
          done={sections.need}
        >
          <Field label="Blood group required" error={errors.bloodGroupId?.message}>
            <BloodGroupPicker
              label="Blood group required"
              bloodGroups={bloodGroups}
              value={values.bloodGroupId}
              onChange={(id) => setValue("bloodGroupId", id, { shouldValidate: true })}
            />
          </Field>

          <Field label="How soon is it needed?">
            <div role="radiogroup" aria-label="How soon is it needed?" className="grid grid-cols-2 gap-3">
              {[
                { urgent: false, icon: CalendarDays, title: "Planned", text: "Within a few days" },
                { urgent: true, icon: Siren, title: "Urgent", text: "Needed today / emergency" },
              ].map(({ urgent, icon: Icon, title, text }) => {
                const selected = (values.isUrgent ?? false) === urgent;
                return (
                  <button
                    key={title}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setValue("isUrgent", urgent)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40",
                      selected && urgent && "border-red-500 bg-red-50 shadow-md shadow-red-500/10",
                      selected && !urgent && "border-primary bg-primary/5",
                      !selected && "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        selected ? "bg-primary text-white" : "bg-gray-100 text-gray-500",
                        selected && urgent && "animate-pulse"
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className={cn("block font-semibold", selected ? "text-primary" : "text-gray-900")}>
                        {title}
                      </span>
                      <span className="block text-xs text-gray-500 sm:text-sm">{text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          {values.isUrgent && (
            <div className="flex flex-col gap-3 rounded-2xl bg-red-600 p-4 text-white sm:flex-row sm:items-center">
              <Siren className="h-6 w-6 shrink-0" aria-hidden="true" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">Life-threatening emergency?</p>
                <p className="text-white/85">Call us now as well — we&apos;ll alert the team immediately.</p>
              </div>
              <Button asChild size="sm" className="h-10 rounded-lg bg-white px-4 font-semibold text-red-700 hover:bg-white/90">
                <a href={`tel:${contactPhoneTel}`}>
                  <Phone className="h-4 w-4" />
                  {contactPhone}
                </a>
              </Button>
            </div>
          )}
        </FormSection>

        {/* 2. Reason */}
        <FormSection
          step={2}
          icon={ClipboardList}
          title="Why is it needed?"
          description="Tap a reason, then add anything that helps — patient name, hospital, units, time."
          done={sections.reason}
        >
          <div className="flex flex-wrap gap-2" aria-label="Common reasons">
            {REASONS.map((chip) => {
              const active = reason.trim().startsWith(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pickReason(chip)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          <Field label="Details" htmlFor="reason" error={errors.reason?.message}>
            <Textarea
              id="reason"
              rows={4}
              maxLength={REASON_MAX}
              placeholder="e.g. Surgery – patient Ravi K., Lakeshore Hospital, 2 units needed by tomorrow 10 AM"
              aria-invalid={!!errors.reason}
              className="min-h-28 rounded-xl border-gray-200 bg-white px-3.5 py-3 text-base text-gray-900 placeholder:text-gray-400 md:text-sm"
              {...register("reason")}
            />
            <p className="text-right text-xs text-gray-400">
              {reason.length}/{REASON_MAX}
            </p>
          </Field>
        </FormSection>

        {/* 3. Contact */}
        <FormSection
          step={3}
          icon={User}
          title="Your contact details"
          description="Who should we call back about this request?"
          done={sections.details}
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

            <Field label="Your age" htmlFor="age" error={errors.age?.message}>
              <Input
                id="age"
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                placeholder="e.g. 32"
                aria-invalid={!!errors.age}
                className={inputClass}
                {...register("age", { valueAsNumber: true })}
              />
            </Field>

            <Field
              label="Mobile number"
              htmlFor="phone"
              error={errors.phone?.message}
              hint={<p className="text-xs text-gray-500">Keep this phone reachable — we&apos;ll call you.</p>}
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

          <div className="space-y-5">
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
          </div>
        </FormSection>

        {/* Consent */}
        <div className="space-y-2">
          <div
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 p-4 transition-colors",
              values.willToDonate
                ? "border-primary/40 bg-rose-50/60"
                : errors.willToDonate
                  ? "border-red-300 bg-red-50/40"
                  : "border-gray-200 bg-gray-50"
            )}
          >
            <Checkbox
              id="willToDonate"
              className="mt-0.5 size-5"
              checked={values.willToDonate}
              aria-invalid={!!errors.willToDonate}
              onCheckedChange={(checked) =>
                setValue("willToDonate", checked === true, { shouldValidate: true })
              }
            />
            <div className="space-y-1">
              <Label htmlFor="willToDonate" className="cursor-pointer font-semibold text-gray-900">
                The details are correct and you may contact me
              </Label>
              <p className="text-sm text-gray-600">
                Blood Connect may call you to follow up on this request and coordinate donors.
              </p>
            </div>
          </div>
          <FieldError message={errors.willToDonate?.message} />
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className={cn(
              "h-13 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/25",
              values.isUrgent && "bg-red-700 hover:bg-red-800"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending request…
              </>
            ) : (
              <>
                {values.isUrgent ? <Siren className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                {values.isUrgent ? "Send Urgent Request" : "Send Blood Request"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Only our coordination team can see your details.
          </p>
        </div>
      </form>
    </div>
  );
}
