"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CONTACT_SUBJECTS, contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitContactMessage } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Field, PhonePrefix, digitsOnlyPhone, inputClass } from "./form-parts";
import { CheckCircle2, Loader2, Lock, Send } from "lucide-react";
import { toast } from "sonner";

const MESSAGE_MAX = 2000;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", website: "" },
  });

  const subject = watch("subject");
  const message = watch("message") ?? "";
  const phoneField = register("phone");

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitContactMessage(data);
      if (result.success) {
        setSentTo(data.name.trim().split(/\s+/)[0]);
        toast.success("Message sent successfully!");
      } else {
        toast.error(result.error || "Couldn't send your message");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sentTo !== null) {
    return (
      <div className="py-10 text-center">
        <div className="relative mx-auto mb-5 h-16 w-16">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-60" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="h-8 w-8" />
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Thanks, {sentTo}!</h3>
        <p className="mx-auto mt-2 max-w-sm text-gray-600">
          Your message has reached our team. We&apos;ll get back to you as soon as we can.
        </p>
        <Button
          variant="outline"
          className="mt-6 h-11 rounded-xl px-5 font-semibold"
          onClick={() => {
            reset();
            setSentTo(null);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Honeypot (hidden from people, tempting for bots) */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Field label="What is this about?" error={errors.subject?.message}>
        <div role="radiogroup" aria-label="What is this about?" className="flex flex-wrap gap-2">
          {CONTACT_SUBJECTS.map((s) => {
            const selected = subject === s;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setValue("subject", s, { shouldValidate: true })}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40",
                  selected
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                    : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:text-primary"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="e.g. Arjun Lal"
            aria-invalid={!!errors.name}
            className={inputClass}
            {...register("name")}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={inputClass}
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Mobile number" htmlFor="phone" optional error={errors.phone?.message}>
        <div className="relative sm:max-w-[calc(50%-0.625rem)]">
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

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={5}
          maxLength={MESSAGE_MAX}
          placeholder="How can we help you?"
          aria-invalid={!!errors.message}
          className="min-h-32 rounded-xl border-gray-200 bg-white px-3.5 py-3 text-base text-gray-900 placeholder:text-gray-400 md:text-sm"
          {...register("message")}
        />
        <p className="text-right text-xs text-gray-400">
          {message.length}/{MESSAGE_MAX}
        </p>
      </Field>

      <div className="space-y-3">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/25"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Send Message
            </>
          )}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Your details are only used to reply to you.
        </p>
      </div>
    </form>
  );
}
