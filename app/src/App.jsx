import { useRef, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Trails from "./components/Trails";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import TrekPlanModal from "./components/TrekPlanModal";

export default function App() {
  // null = closed; { trail } = open, optionally prefilled from a trail
  const [plan, setPlan] = useState(null);
  const trailsRef = useRef(null);
  const openPlan = (trail = null) => setPlan({ trail });

  return (
    <>
      <Header onOpenPlan={() => openPlan()} onFindNear={() => trailsRef.current?.showNearMe()} />
      <main>
        <Hero />
        <Trails ref={trailsRef} onPlan={(trail) => openPlan(trail)} />
        <CtaBand onOpenPlan={() => openPlan()} />
      </main>
      <Footer />
      {plan && <TrekPlanModal trail={plan.trail} onClose={() => setPlan(null)} />}
    </>
  );
}
