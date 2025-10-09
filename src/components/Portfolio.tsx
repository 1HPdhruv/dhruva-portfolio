import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "EV Troubleshooter",
    category: "ML",
    description: "Machine learning system for diagnosing electric vehicle issues using sensor data and predictive analytics.",
    tags: ["Python", "TensorFlow", "Scikit-learn", "Data Analysis"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop",
  },
  {
    title: "AI Crop Recommendation System",
    category: "ML",
    description: "AI-powered platform recommending optimal crops based on soil conditions, climate, and historical data.",
    tags: ["Machine Learning", "Python", "Flask", "Data Science"],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop",
  },
  {
    title: "Maze Solving Robot",
    category: "Robotics",
    description: "Autonomous robot using sensors and pathfinding algorithms to navigate complex mazes efficiently.",
    tags: ["Arduino", "C++", "Sensors", "Algorithms"],
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&auto=format&fit=crop",
  },
  {
    title: "E-Commerce Platform",
    category: "Web",
    description: "Full-stack e-commerce application with product management, cart, and secure payment integration.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop",
  },
  {
    title: "Task Management App",
    category: "Web",
    description: "Collaborative task management platform with real-time updates, team features, and analytics.",
    tags: ["React", "Firebase", "Tailwind CSS", "TypeScript"],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop",
  },
  {
    title: "Weather Dashboard",
    category: "Web",
    description: "Real-time weather application with forecasts, maps, and location-based alerts.",
    tags: ["React", "API Integration", "Charts", "Geolocation"],
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&auto=format&fit=crop",
  },
];

const categories = ["All", "Web", "ML", "Robotics"];

export const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A showcase of my work across web development, machine learning, and robotics
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="transition-all"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <Badge variant="secondary">{project.category}</Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Demo
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href="https://github.com/1HPdhruv" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
