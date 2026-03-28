import { Button } from "@/components/ui/button";
import { Cross, Menu, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import type { AppTab } from "../App";

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const navTabs: { label: string; value: AppTab }[] = [
  { label: "Home", value: "home" },
  { label: "Appointments", value: "appointments" },
  { label: "Billing", value: "billing" },
];

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTab = (tab: AppTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-sm border-b border-border shadow-xs">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5 group"
            onClick={() => handleTab("home")}
            data-ocid="nav.link"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Cross className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="text-left">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-clinic-heading tracking-tight leading-none">
                  FATIMA MEDICARE
                </span>
                <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  GUJARKHAN
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Stethoscope className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary font-medium tracking-wide">
                  Ultrasound Dept
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === tab.value
                    ? "bg-primary text-white"
                    : "text-clinic-body hover:text-primary hover:bg-secondary"
                }`}
                onClick={() => handleTab(tab.value)}
                data-ocid="nav.tab"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Button
              className="hidden lg:flex bg-primary text-white rounded-full px-5 hover:bg-primary/90 font-semibold text-sm"
              onClick={() => handleTab("appointments")}
              data-ocid="nav.primary_button"
            >
              Book Appointment
            </Button>
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-clinic-body hover:text-primary hover:bg-secondary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              data-ocid="nav.toggle"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="lg:hidden border-t border-border py-3 space-y-1"
            data-ocid="nav.modal"
          >
            {navTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-md transition-colors ${
                  activeTab === tab.value
                    ? "bg-primary text-white"
                    : "text-clinic-body hover:text-primary hover:bg-secondary"
                }`}
                onClick={() => handleTab(tab.value)}
                data-ocid="nav.tab"
              >
                {tab.label}
              </button>
            ))}
            <div className="pt-2 pb-1">
              <Button
                className="w-full bg-primary text-white rounded-full font-semibold hover:bg-primary/90"
                onClick={() => handleTab("appointments")}
                data-ocid="nav.primary_button"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
