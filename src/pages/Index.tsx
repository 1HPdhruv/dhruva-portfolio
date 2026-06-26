import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Research } from "@/components/Research";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { IntroSequence } from "@/components/IntroSequence";

const Index = () => {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && (
        <IntroSequence onComplete={() => setIntroDone(true)} />
      )}
      <div
        className="min-h-screen"
        style={{
          opacity: introDone ? 1 : 0,
          transition: "opacity 0.8s ease",
          pointerEvents: introDone ? "auto" : "none",
        }}
      >
        <Navigation />
        <main>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Research />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
