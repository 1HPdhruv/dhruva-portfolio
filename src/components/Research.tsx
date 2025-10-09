import { Sparkles, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Research = () => {
  return (
    <section id="research" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Research</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Pushing boundaries in AI and immersive technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/30 animate-scale-in">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      AI-Based Depth Completion for Immersive AR/VR
                    </CardTitle>
                    <CardDescription className="text-base">
                      Ongoing Research Project
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-accent text-accent-foreground">In Progress</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-lg">Overview</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Developing advanced machine learning models to reconstruct complete depth maps from sparse
                  sensor data, enabling more realistic and immersive AR/VR experiences. The research focuses
                  on real-time processing and accuracy optimization for consumer-grade devices.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Timeline
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
                      <span>Q1 2024: Literature review and dataset collection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
                      <span>Q2 2024: Model architecture development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-accent rounded-full mr-2 mt-1.5"></span>
                      <span>Q3-Q4 2024: Training and optimization (Current)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-muted rounded-full mr-2 mt-1.5"></span>
                      <span>Q1 2025: Publication and deployment</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Key Objectives</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
                      <span>Real-time depth map reconstruction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
                      <span>High accuracy with sparse input data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
                      <span>Optimization for mobile devices</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
                      <span>Novel architecture for depth completion</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Collaboration</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Open to collaboration with researchers and institutions interested in AR/VR technology
                  and computer vision. Looking for advisors and potential co-authors for publication.
                </p>
                <div className="flex gap-3">
                  <Button variant="default" asChild>
                    <a href="#contact">Collaborate</a>
                  </Button>
                  <Button variant="outline">View Proposal</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">1st</div>
              <div className="text-sm text-muted-foreground">Ideathon Winner</div>
            </Card>
            <Card className="text-center p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="text-3xl font-bold text-accent mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Hackathon Participations</div>
            </Card>
            <Card className="text-center p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="text-3xl font-bold text-primary mb-2">1st</div>
              <div className="text-sm text-muted-foreground">Creative Ingenuity Prize</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
