import { Card } from "@/components/ui/card";
import { Truck, Shield, Sparkles, Users } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Custom Printing",
    description: "Your design, professionally printed on premium quality tees. Stand out from the crowd."
  },
  {
    icon: Truck,
    title: "India-Wide Delivery",
    description: "Fast and reliable delivery across all of India. Your style, delivered to your doorstep."
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "We stand by our promises. Premium materials, vibrant prints, lasting quality."
  },
  {
    icon: Users,
    title: "Made for GenZ",
    description: "Anime aesthetics, oversized fits, minimalist designs. Everything you love."
  }
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-hero opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-foreground">Why </span>
            <span className="text-primary">Khichik?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're not just another T-shirt brand. We're your creative partner 
            in expressing who you are, one tee at a time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 border-border/50 hover:border-primary/50 transition-smooth shadow-card bg-card/50 backdrop-blur-sm group text-center"
              >
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-smooth">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Brand Promise */}
        <Card className="max-w-4xl mx-auto p-8 md:p-12 border-2 border-primary/30 shadow-glow bg-card/50 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-primary">
              Our Promise to You
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At <span className="text-foreground font-semibold">Khichik</span>, we believe in authenticity, 
              quality, and keeping our promises. Whether you're ordering a custom design or choosing from our 
              collection, you're getting premium oversized tees that match your vibe. We're here to help 
              you express yourself, affordably and stylishly.
            </p>
            <div className="pt-4">
              <p className="text-xl font-semibold text-foreground">
                Your style. Your story. <span className="text-primary">Your Khichik.</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
