import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Trails from "./components/Trails";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import TrekPlanModal from "./components/TrekPlanModal";

export default function App() {
  // null = closed; { trail } = open, optionally prefilled from a trail
  const [plan, setPlan] = useState(null);
  const openPlan = (trail = null) => setPlan({ trail });

  return (
    <>
      <Header onOpenPlan={() => openPlan()} />
      <main>
        <Hero onOpenPlan={() => openPlan()} />
        <Trails onPlan={(trail) => openPlan(trail)} />
        <HowItWorks />
        <CtaBand onOpenPlan={() => openPlan()} />
      </main>
      <Footer />
      {plan && <TrekPlanModal trail={plan.trail} onClose={() => setPlan(null)} />}
    </>
  );
}
