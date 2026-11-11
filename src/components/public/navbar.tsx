"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Droplet, Menu, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Donate Blood", href: "/donate" },
  { name: "Request Blood", href: "/request-blood" },
  { name: "Health Awareness", href: "/health-awareness" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function BecomeDonorButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Button asChild className={cn("h-10 rounded-lg px-5 font-semibold shadow-sm", className)}>
      <Link href="/donate" onClick={onClick}>
        <Droplet className="w-4 h-4" fill="currentColor" />
        Become a Donor
      </Link>
    </Button>
  );
}

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 border-b border-gray-100">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-[4.5rem]">
          <BrandLogo />

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-2 text-[13px] font-medium transition-colors",
                    active ? "text-primary font-semibold" : "text-gray-700 hover:text-primary"
                  )}
                >
                  {item.name}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <BecomeDonorButton />
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <div className="flex flex-col h-full">
                <BrandLogo className="mb-8" onClick={() => setMobileMenuOpen(false)} />

                <nav className="flex flex-col w-full gap-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "w-full block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                        pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-6 border-t">
                  <BecomeDonorButton className="w-full" onClick={() => setMobileMenuOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
