"use client";

import type { ChangeEvent, ReactNode } from "react";
import { AlertCircle, Building2, CheckCircle2, Droplet, Laptop, type LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Shared building blocks for the public donor / blood-request forms. */

export const inputClass =
  "h-11 rounded-xl border-gray-200 bg-white px-3.5 text-base text-gray-900 shadow-xs placeholder:text-gray-400 md:text-sm";

export interface BloodGroupOption {
  id: string;
  name: string;
  displayName: string;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-center gap-1.5 text-sm text-red-600">
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  optional,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  optional?: boolean;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-800">
        {label}
        {optional && <span className="ml-1 font-normal text-gray-400">(optional)</span>}
      </Label>
      {children}
      {error ? <FieldError message={error} /> : hint}
    </div>
  );
}

export function FormSection({
  step,
  icon: Icon,
  title,
  description,
  done,
  children,
}: {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  done?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="flex w-full items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
            done ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"
          )}
          aria-hidden="true"
        >
          {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </span>
        <span>
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Step {step}
          </span>
          <span className="block text-base font-semibold text-gray-900">{title}</span>
        </span>
      </legend>
      <p className="-mt-2 text-sm text-gray-500">{description}</p>
      {children}
    </fieldset>
  );
}

/** Card header with a "x/n" counter and progress bar. */
export function FormProgressHeader({
  title,
  subtitle,
  completed,
  total,
}: {
  title: string;
  subtitle: string;
  completed: number;
  total: number;
}) {
  const progress = Math.round((completed / total) * 100);
  return (
    <div className="border-b border-gray-100 px-6 pb-5 pt-7 sm:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {completed}/{total}
        </span>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-label="Form progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/** Eight tappable blood-group tiles (radio group). */
export function BloodGroupPicker({
  bloodGroups,
  value,
  onChange,
  label = "Blood group",
}: {
  bloodGroups: BloodGroupOption[];
  value?: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-4 gap-2 sm:gap-3">
      {bloodGroups.map((bg) => {
        const selected = value === bg.id;
        return (
          <button
            key={bg.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(bg.id)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 rounded-2xl border-2 py-3 transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40",
              selected
                ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                : "border-gray-200 bg-white text-gray-800 hover:border-primary/40 hover:bg-rose-50"
            )}
          >
            <Droplet
              className={cn("h-4 w-4", selected ? "text-white" : "text-primary")}
              fill="currentColor"
              aria-hidden="true"
            />
            <span className="text-lg font-bold leading-none">{bg.displayName}</span>
          </button>
        );
      })}
    </div>
  );
}

/** IT employee / Non-IT radio cards. */
export function ItEmployeePicker({
  value,
  onChange,
}: {
  value?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Are you an IT employee?" className="grid grid-cols-2 gap-3">
      {[
        { value: true, label: "IT Employee", icon: Laptop },
        { value: false, label: "Non-IT", icon: Building2 },
      ].map(({ value: optionValue, label, icon: Icon }) => {
        const selected = value === optionValue;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(optionValue)}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40",
              selected
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {label}
            <span
              className={cn(
                "ml-auto flex h-5 w-5 items-center justify-center rounded-full border-2",
                selected ? "border-primary bg-primary" : "border-gray-300"
              )}
              aria-hidden="true"
            >
              {selected && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** "+91" adornment shown inside the phone input. */
export function PhonePrefix() {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-gray-200 pl-3.5 pr-3 text-sm font-medium text-gray-500">
      +91
    </span>
  );
}

/**
 * Wraps a react-hook-form onChange so the phone field only keeps 10 digits
 * (strips spaces, dashes and a pasted +91 / 91 prefix).
 */
export function digitsOnlyPhone(onChange: (e: ChangeEvent<HTMLInputElement>) => unknown) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
    e.target.value = digits.slice(0, 10);
    return onChange(e);
  };
}

export const isValidPhone = (value?: string) => /^\d{10}$/.test(value ?? "");
