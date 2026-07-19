import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Trails from "./components/Trails";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import PermitModal from "./components/PermitModal";

export default function App() {
  const [permitOpen, setPermitOpen] = useState(false);

  return (
    <>
      <Header onOpenPermit={() => setPermitOpen(true)} />
      <main>
        <Hero onOpenPermit={() => setPermitOpen(true)} />
        <HowItWorks />
        <Trails />
        <CtaBand onOpenPermit={() => setPermitOpen(true)} />
      </main>
      <Footer />
      {permitOpen && <PermitModal onClose={() => setPermitOpen(false)} />}
    </>
  );
}