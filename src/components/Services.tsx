import { Code2, Globe, Brain, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description: "Java backend with Spring Boot, API design, database connectivity, and modern React + Tailwind frontends.",
    deliverables: ["RESTful APIs", "Database Design", "Responsive UI", "Authentication"],
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "Responsive single-page applications, progressive web apps, and modern web experiences.",
    deliverables: ["SPA/SSR", "PWA Ready", "Performance Optimized", "Cross-browser"],
    color: "text-accent",
  },
  {
    icon: Brain,
    title: "Machine Learning & Data Analysis",
    description: "Model training, data pipelines, and applied ML solutions for real-world problems.",
    deliverables: ["Model Training", "Data Processing", "Predictive Analytics", "ML Integration"],
    color: "text-primary",
  },
  {
    icon: Trophy,
    title: "Problem Solving",
    description: "Algorithm design, optimization, and competitive programming expertise for complex challenges.",
    deliverables: ["Algorithm Design", "Code Optimization", "DSA Solutions", "Technical Consulting"],
    color: "text-accent",
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Services</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive development solutions tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:border-primary/50 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`${service.color} mb-4`}>
                    <Icon className="h-12 w-12" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10" asChild>
                    <a href="#contact">Request Project</a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
