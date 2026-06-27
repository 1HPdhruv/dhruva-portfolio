import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Research } from "@/components/Research";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { IntroSequence } from "@/components/IntroSequence";
import { Drake } from "@/components/Drake";

const Index = () => {
  return (
    <>
      <IntroSequence />
      <div className="min-h-screen opacity-100 pointer-events-auto">
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
        <Drake />
      </div>
    </>
  );
};

export default Index;
