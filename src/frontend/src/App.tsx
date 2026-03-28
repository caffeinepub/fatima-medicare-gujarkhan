import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Navbar from "./components/Navbar";
import AppointmentsView from "./views/AppointmentsView";
import BillingView from "./views/BillingView";
import HomeView from "./views/HomeView";

export type AppTab = "home" | "appointments" | "billing";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("home");

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === "home" && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === "appointments" && <AppointmentsView />}
        {activeTab === "billing" && <BillingView />}
      </main>
    </div>
  );
}
