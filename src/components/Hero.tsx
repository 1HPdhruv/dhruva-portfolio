import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Phone, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import profileHero from "@/assets/profile-hero.jpg";

export const Hero = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const targets = [5, 7, 10];
    const steps = 50;
    
    const increments = targets.map(target => target / steps);
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount1(Math.round(increments[0] * currentStep));
        setCount2(Math.round(increments[1] * currentStep));
        setCount3(Math.round(increments[2] * currentStep));
      } else {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden gradient-hero"
    >
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,hsl(180_80%_50%/0.15),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,hsl(35_90%_60%/0.12),transparent_50%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[conic-gradient(from_0deg,hsl(180_80%_50%/0.1),transparent_120deg,transparent_240deg,hsl(35_90%_60%/0.08)_360deg)] animate-spin-slow"></div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-block">
                <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-2 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-primary inline-block"></span>
                  Hi, I'm
                </p>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tight">
                <span className="block">Dhruva</span>
                <span className="block text-gradient">Mishra</span>
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground font-light">
                Full-Stack Developer & ML Enthusiast
              </h2>
            </div>

            <p className="text-lg text-foreground/80 max-w-lg leading-relaxed">
              I craft interactive web experiences, train machine learning models, and research
              immersive AR/VR depth completion.{" "}
              <span className="text-primary font-semibold relative inline-block">
                Build. Break. Learn. Repeat.
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/50"></span>
              </span>
            </p>

            {/* Stats - Enhanced Glass Cards */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="glass-card p-4 rounded-xl hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-gradient mb-1">{count1}+</div>
                <div className="text-xs text-muted-foreground">Web Apps</div>
              </div>
              <div className="glass-card p-4 rounded-xl hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-gradient mb-1">{count2}+</div>
                <div className="text-xs text-muted-foreground">Robotics Projects</div>
              </div>
              <div className="glass-card p-4 rounded-xl hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-gradient mb-1">{count3}+</div>
                <div className="text-xs text-muted-foreground">Hackathons</div>
              </div>
            </div>

            {/* CTAs - Enhanced Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" variant="hero" asChild className="group">
                <a href="#portfolio" className="gap-2">
                  View Portfolio
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="group">
                <a href="/resume.pdf" download className="gap-2">
                  <Download className="h-4 w-4 group-hover:animate-bounce" />
                  Download Resume
                </a>
              </Button>
            </div>

            {/* Social Links - Enhanced */}
            <div className="flex gap-3 pt-4">
              {[
                { icon: Github, href: "https://github.com/1HPdhruv", label: "GitHub" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/1hpdhruv", label: "LinkedIn" },
                { icon: Mail, href: "mailto:mishradhruva19@gmail.com", label: "Email" },
                { icon: Phone, href: "tel:+919263894272", label: "Phone" }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? "_blank" : undefined}
                  rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="glass-card p-3 rounded-lg hover:bg-primary/10 hover:border-primary/50 transition-all group"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Content - Enhanced Profile Card */}
          <div className="flex justify-center animate-slide-in-right">
            <div className="relative group">
              {/* Animated glow rings */}
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl animate-glow-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 to-primary/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
              
              {/* Profile image container */}
              <div className="relative animate-float">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  {/* Glass border effect */}
                  <div className="absolute inset-0 rounded-full glass-card border-2 border-primary/30 p-2">
                    <img
                      src={profileHero}
                      alt="Dhruva Mishra - Full-Stack Developer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  
                  {/* Orbital decoration */}
                  <div className="absolute -inset-4 rounded-full border border-primary/20 animate-spin-slow"></div>
                  <div className="absolute -inset-8 rounded-full border border-accent/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }}></div>
                </div>
                
                {/* Enhanced Badge */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-max">
                  <div className="glass-card px-6 py-3 rounded-full border border-primary/30 shadow-lg shadow-primary/10">
                    <p className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                      Full-Stack • ML • Competitive Programming
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary" />
        </div>
      </div>
    </section>
  );
};
