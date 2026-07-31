const STEPS = [
  {
    title: "Choose a Trek",
    body: "Browse popular trekking destinations across Karnataka.",
  },
  {
    title: "Add Your Group",
    body: "Enter trek details and the information for each participant.",
  },
  {
    title: "Generate Permit",
    body: "Create a QR-enabled permit for every trekker instantly.",
  },
  {
    title: "Start Trekking",
    body: "Download your permit and carry it throughout your journey.",
  },
];

// const TOKENS = {
//   pine: "#2a513f",
//   sprout: "#cef79f",
//   leaf: "#83ba36",
//   teal: "#378e8e",
//   mint: "#70e0bb",
// };

export default function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden py-24 bg-[#cef79f] border-y-4 border-[#2a513f]">
      <div className="absolute inset-0 opacity-[0.08] bg-[url('/how-it-works.jpg')] bg-cover bg-center mix-blend-multiply" />

      {/* subtle accent wash */}
      <div className="absolute top-0 right-0 w- h- bg-[#70e0bb]/30 blur- rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w- h- bg-[#83ba36]/20 blur- rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 inline-block border-2 border-[#2a513f] bg-[#70e0bb] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#2a513f]">
            How it works
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-[#2a513f]">
            Generate your trekking permit in minutes
          </h2>

          <p className="mt-4 text-lg font-medium text-[#2a513f]/80">
            A simple four-step process designed to help trekkers register,
            generate permits, and explore safely.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="group relative border-4 border-[#2a513f] bg-white p-6 shadow-[6px_6px_0px_0px_#2a513f] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#2a513f]"
            >
              {/* top color bar */}
              <div className="absolute top-0 left-0 w-full h-2 flex">
                <div className="flex-1 bg-[#83ba36]"></div>
                <div className="flex-1 bg-[#70e0bb]"></div>
                <div className="flex-1 bg-[#378e8e]"></div>
              </div>

              <div className="mb-5 mt-2 flex h-12 w-12 items-center justify-center border-4 border-[#2a513f] bg-[#cef79f] text-lg font-black text-[#2a513f] shadow-[3px_3px_0px_0px_#2a513f] group-hover:bg-[#83ba36] transition-colors">
                {index + 1}
              </div>

              <h3 className="text-lg font-black uppercase tracking-tight text-[#2a513f]">
                {step.title}
              </h3>

              <p className="mt-3 leading-6 font-medium text-[#2a513f]/70 text-sm">
                {step.body}
              </p>

              <div className="mt-5 flex gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2a513f]"></div>
                <div className={`h-1.5 w-1.5 rounded-full ${index >= 1? 'bg-[#2a513f]' : 'bg-[#2a513f]/20'}`}></div>
                <div className={`h-1.5 w-1.5 rounded-full ${index >= 2? 'bg-[#2a513f]' : 'bg-[#2a513f]/20'}`}></div>
                <div className={`h-1.5 w-1.5 rounded-full ${index >= 3? 'bg-[#2a513f]' : 'bg-[#2a513f]/20'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}