import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Trails from "./components/Trails";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import PermitModal from "./components/PermitModal";

export default function App() {
  // null = closed; { trail } = open, optionally prefilled from a trail
  const [permit, setPermit] = useState(null);
  const openPermit = (trail = null) => setPermit({ trail });

  return (
    <>
      <Header onOpenPermit={() => openPermit()} />
      <main>
        <Hero onOpenPermit={() => openPermit()} />
        <Trails onPlan={(trail) => openPermit(trail)} />
        <HowItWorks />
        <CtaBand onOpenPermit={() => openPermit()} />
      </main>
      <Footer />
      {permit && <PermitModal trail={permit.trail} onClose={() => setPermit(null)} />}
    </>
  );
}
