import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OrbitingSkills } from "@/components/OrbitingSkills";

const education = [
  {
    school: "SRM Institute Of Science And Technology, Chennai",
    degree: "B.Tech in Computer Science",
    year: "2024 - 2028 (Expected)",
  },
  {
    school: "St. Xavier's School, Bokaro Steel City",
    degree: "Intermediate",
    year: "2024",
  },
  {
    school: "St. Xavier's School, Bokaro Steel City",
    degree: "Matriculation",
    year: "2022",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A passionate developer turning bold ideas into interactive digital experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Bio */}
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold">My Journey</h3>
            <p className="text-muted-foreground leading-relaxed">
              I'm a full-stack developer with a strong foundation in Java backend development and modern
              React frontends. My journey started with competitive programming, which taught me to think
              algorithmically and solve complex problems efficiently.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Beyond web development, I'm deeply interested in machine learning and its practical applications.
              I've worked on projects ranging from EV troubleshooting systems to AI-powered crop recommendations,
              always pushing to learn more and build better solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My robotics projects have given me hands-on experience with hardware integration and control
              algorithms. Currently, I'm researching AI-based depth completion for immersive AR/VR experiences,
              combining my interests in ML and interactive technology.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
              "Build. Break. Learn. Repeat."
              <span className="block text-sm text-muted-foreground mt-2">— My approach to development</span>
            </blockquote>
          </div>

          {/* Education Timeline */}
          <div className="animate-slide-in-right">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              Education
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card key={index} className="p-6 border-l-4 border-primary hover:bg-card transition-colors">
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-lg">{edu.school}</h4>
                    <p className="text-muted-foreground">{edu.degree}</p>
                    <p className="text-sm text-primary mt-2">{edu.year}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Skills - Orbiting Tech Stack */}
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 text-center">Technical Skills</h3>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            Hover an icon to explore the tech stack orbiting the central AI core.
          </p>
          <OrbitingSkills />
        </div>
      </div>
    </section>
  );
};
