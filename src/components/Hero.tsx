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
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center md:items-start">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <p className="text-primary font-medium">Hi, I'm</p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Dhruva Mishra
              </h1>
              <h2 className="text-2xl md:text-3xl text-muted-foreground">
                Full-Stack Developer & ML Enthusiast
              </h2>
            </div>

            <p className="text-lg text-muted-foreground max-w-lg">
              I craft interactive web experiences, train machine learning models, and research
              immersive AR/VR depth completion. <span className="text-primary font-semibold">Build. Break. Learn. Repeat.</span>
            </p>

            {/* Stats */}
            <div className="flex gap-6 py-4">
              <div>
                <div className="text-3xl font-bold text-primary">{count1}+</div>
                <div className="text-sm text-muted-foreground">Web Apps</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">{count2}+</div>
                <div className="text-sm text-muted-foreground">Robotics Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{count3}+</div>
                <div className="text-sm text-muted-foreground">Hackathons</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <a href="#portfolio">View Portfolio</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/resume.pdf" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://github.com/1HPdhruv"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/1hpdhruv"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="mailto:mishradhruva19@gmail.com"
                className="hover:text-primary transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
              <a
                href="tel:+919263894272"
                className="hover:text-primary transition-colors"
              >
                <Phone className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Right Content - Profile Card */}
          <div className="flex justify-center animate-slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full blur-2xl animate-pulse-glow"></div>
              <div className="relative">
                <img
                  src={profileHero}
                  alt="Dhruva Mishra"
                  className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-full border-4 border-primary/50"
                />
                <Badge className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm text-sm px-4 py-2 border border-primary/30">
                  Full-Stack • ML • Competitive Programming
                </Badge>
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
