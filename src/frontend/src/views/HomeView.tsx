import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  Baby,
  ChevronRight,
  Clock,
  Cross,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ScanLine,
  Shield,
  Stethoscope,
  Waves,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppTab } from "../App";

const services = [
  {
    icon: <Activity className="w-7 h-7" />,
    title: "Abdomen Ultrasound",
    description:
      "Evaluation of liver, kidneys, gallbladder, spleen and abdominal organs with high-resolution imaging.",
  },
  {
    icon: <Waves className="w-7 h-7" />,
    title: "Breast Ultrasound",
    description:
      "High-resolution imaging of breast tissue for detection of lumps, cysts, and abnormalities.",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Thyroid Ultrasound",
    description:
      "High-frequency imaging of the thyroid gland to detect nodules, cysts, and glandular conditions.",
  },
  {
    icon: <Stethoscope className="w-7 h-7" />,
    title: "Inguinal / Scrotal Ultrasound",
    description:
      "Detailed examination of the inguinal region and scrotum for hernias, varicoceles, and testicular conditions.",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "FAST Ultrasound",
    description:
      "Focused Assessment with Sonography for Trauma — rapid evaluation for internal bleeding and fluid.",
  },
  {
    icon: <Baby className="w-7 h-7" />,
    title: "OBS Ultrasound",
    description:
      "Safe, detailed obstetric scans monitoring fetal growth, position, and maternal health.",
  },
  {
    icon: <ScanLine className="w-7 h-7" />,
    title: "Early OBS Ultrasound",
    description:
      "Early pregnancy scanning for confirmation, dating, and viability assessment in the first trimester.",
  },
];

const doctors = [
  {
    name: "Dr. M. Siddique Darr",
    specialty: "Radiologist & Sonologist",
    image: "/assets/generated/doctor1.dim_300x300.jpg",
    bio: "Specialist in diagnostic ultrasound and radiology, providing accurate and compassionate diagnostic care at Fatima Medicare Gujarkhan.",
  },
];

interface HomeViewProps {
  setActiveTab: (tab: AppTab) => void;
}

export default function HomeView({ setActiveTab }: HomeViewProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success("Inquiry received! We'll call you shortly.", {
      description: `Thank you, ${form.name}. Our team will contact you at ${form.phone}.`,
    });
    setForm({ name: "", phone: "", service: "", message: "" });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="pt-16">
      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/clinic-hero.dim_1200x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-clinic-navy/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/25 uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Now Open · Mon–Sat 9am–7pm
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
              FATIMA MEDICARE
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-sky-300 mb-4">
              GUJARKHAN
            </h2>
            <p className="text-lg text-white/70 font-medium mb-2 tracking-wide uppercase">
              Ultrasound Department
            </p>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Advanced Diagnostic Imaging for Every Patient. State-of-the-art
              ultrasound technology with compassionate care in the heart of
              Gujarkhan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-primary text-white rounded-full px-8 font-semibold hover:bg-primary/90 shadow-lg"
                onClick={() => setActiveTab("appointments")}
                data-ocid="hero.primary_button"
              >
                Book an Appointment
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-semibold text-white border-white/50 bg-white/10 hover:bg-white/20 hover:text-white"
                onClick={() => scrollTo("about")}
                data-ocid="hero.secondary_button"
              >
                Learn More
              </Button>
            </div>
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { value: "10,000+", label: "Patients Served" },
                { value: "1", label: "Expert Doctors" },
                { value: "8+", label: "Years of Service" },
                { value: "7", label: "Ultrasound Services" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-card">
                <img
                  src="/assets/generated/clinic-hero.dim_1200x600.jpg"
                  alt="Fatima Medicare Gujarkhan"
                  className="w-full h-80 lg:h-[440px] object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-primary text-white rounded-2xl p-5 shadow-xl hidden sm:block">
                <div className="text-3xl font-bold">8+</div>
                <div className="text-sm opacity-80">Years of Excellence</div>
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                About Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-clinic-heading mt-2 mb-6 leading-tight">
                About Fatima Medicare Gujarkhan
              </h2>
              <p className="text-clinic-body leading-relaxed mb-5">
                Fatima Medicare Gujarkhan is a trusted diagnostic imaging center
                located in the heart of Main Bazaar, Gujarkhan. Established to
                serve the community of Rawalpindi Division, we specialize in
                ultrasound diagnostics with a commitment to accuracy, comfort,
                and affordability.
              </p>
              <p className="text-clinic-body leading-relaxed mb-8">
                Our mission is to provide every patient — from expectant mothers
                to those requiring complex abdominal and cardiac evaluations —
                with timely, precise, and compassionate diagnostic care. We use
                modern ultrasound technology operated by certified radiologists
                and sonologists to ensure the highest standards of diagnosis.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: "10,000+", label: "Patients Served" },
                  { value: "1", label: "Expert Doctors" },
                  { value: "8+", label: "Years Service" },
                  { value: "7", label: "Scan Types" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 bg-secondary rounded-xl"
                  >
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-clinic-body mt-1 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 bg-clinic-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-clinic-heading mt-2">
              Our Ultrasound Services
            </h2>
            <p className="text-clinic-body mt-3 max-w-xl mx-auto">
              Comprehensive diagnostic ultrasound services for all ages — from
              prenatal care to cardiac and abdominal evaluations.
            </p>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="services.list"
          >
            {services.map((service, i) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-6 flex gap-4 shadow-card hover:shadow-card-hover transition-shadow"
                data-ocid={`services.item.${i + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-clinic-heading mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-clinic-body leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section id="doctors" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-clinic-heading mt-2">
              Meet Our Expert Doctor
            </h2>
            <p className="text-clinic-body mt-3 max-w-xl mx-auto">
              Our board-certified radiologist and sonologist is dedicated to
              delivering accurate diagnoses with the utmost care.
            </p>
          </div>
          <div className="flex justify-center" data-ocid="doctors.list">
            {doctors.map((doc, i) => (
              <div
                key={doc.name}
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 w-full max-w-sm"
                data-ocid={`doctors.item.${i + 1}`}
              >
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-clinic-heading text-lg">
                    {doc.name}
                  </h3>
                  <p className="text-primary text-sm font-semibold mb-3">
                    {doc.specialty}
                  </p>
                  <p className="text-clinic-body text-sm leading-relaxed">
                    {doc.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPOINTMENT INQUIRY */}
      <section id="appointments" className="py-20 bg-clinic-light-blue">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-clinic-heading mt-2">
              Book an Appointment
            </h2>
            <p className="text-clinic-body mt-3">
              Leave your details and we'll confirm your appointment. Or visit
              our{" "}
              <button
                type="button"
                className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80"
                onClick={() => setActiveTab("appointments")}
              >
                Appointments System
              </button>{" "}
              for full management.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-card p-6 sm:p-8 space-y-5"
            data-ocid="appointment.modal"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="appt-name"
                  className="text-clinic-heading font-medium"
                >
                  Full Name *
                </Label>
                <Input
                  id="appt-name"
                  required
                  placeholder="Muhammad Ali"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="appointment.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="appt-phone"
                  className="text-clinic-heading font-medium"
                >
                  Phone Number *
                </Label>
                <Input
                  id="appt-phone"
                  type="tel"
                  required
                  placeholder="+92-300-0000000"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  data-ocid="appointment.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-clinic-heading font-medium">
                Select Service
              </Label>
              <Select
                value={form.service}
                onValueChange={(v) => setForm((p) => ({ ...p, service: v }))}
              >
                <SelectTrigger data-ocid="appointment.select">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.title} value={s.title}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="appt-message"
                className="text-clinic-heading font-medium"
              >
                Message / Notes
              </Label>
              <Textarea
                id="appt-message"
                placeholder="Describe your symptoms or any additional information..."
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                className="resize-none"
                data-ocid="appointment.textarea"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white rounded-full py-6 text-base font-semibold hover:bg-primary/90"
              data-ocid="appointment.submit_button"
            >
              {submitting ? "Submitting..." : "Send Inquiry"}
            </Button>
          </form>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Find Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-clinic-heading mt-2">
              Contact &amp; Location
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Map Placeholder */}
            <div
              className="w-full h-72 rounded-2xl bg-secondary border border-border flex flex-col items-center justify-center overflow-hidden relative"
              data-ocid="contact.map_marker"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-clinic-light-blue" />
              <div className="relative flex flex-col items-center gap-3 text-clinic-body">
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <p className="font-bold text-clinic-heading text-xl">
                  Fatima Medicare
                </p>
                <p className="text-clinic-body font-medium">
                  Main Bazaar, Gujarkhan
                </p>
                <p className="text-sm text-clinic-body/70">
                  Rawalpindi, Punjab, Pakistan
                </p>
                <a
                  href="https://maps.google.com/?q=Gujarkhan+Rawalpindi+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-sm text-primary font-semibold underline underline-offset-2 hover:text-primary/80"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: "Address",
                  value: "Main Bazaar, Gujarkhan, Rawalpindi, Punjab, Pakistan",
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  label: "Phone",
                  value: "+92-51-1234567",
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  label: "Email",
                  value: "info@fatimamedicare.pk",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  label: "Hours",
                  value:
                    "Mon–Sat: 9:00 AM – 7:00 PM · Fri: 2:00 PM – 7:00 PM (after Juma)",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-clinic-light-blue transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-clinic-body text-sm mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-clinic-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Cross className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">
                    FATIMA MEDICARE
                  </div>
                  <div className="text-xs text-white/60">GUJARKHAN</div>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Advanced diagnostic ultrasound services with compassionate care
                for the people of Gujarkhan.
              </p>
              <div className="flex gap-3">
                {[
                  {
                    Icon: Facebook,
                    label: "Facebook",
                    href: "https://facebook.com",
                  },
                  {
                    Icon: Instagram,
                    label: "Instagram",
                    href: "https://instagram.com",
                  },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-white mb-4">Our Services</h4>
              <ul className="space-y-2.5">
                {services.map((s) => (
                  <li key={s.title}>
                    <button
                      type="button"
                      onClick={() => scrollTo("services")}
                      className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Doctors */}
            <div>
              <h4 className="font-semibold text-white mb-4">Our Doctor</h4>
              <ul className="space-y-2.5">
                {doctors.map((d) => (
                  <li key={d.name}>
                    <button
                      type="button"
                      onClick={() => scrollTo("doctors")}
                      className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5 text-left"
                    >
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>
                        {d.name}{" "}
                        <span className="text-white/40">· {d.specialty}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Main Bazaar, Gujarkhan, Rawalpindi</span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+92-51-1234567</span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>info@fatimamedicare.pk</span>
                </li>
                <li className="flex items-start gap-3 text-white/60 text-sm">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Mon–Sat: 9am–7pm
                    <br />
                    Fri: 2pm–7pm (after Juma)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/50 text-sm">
              © {currentYear} Fatima Medicare Gujarkhan. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 underline underline-offset-2 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
