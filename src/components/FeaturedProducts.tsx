import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const products = [
  {
    id: 1,
    name: "Spidey Motion",
    price: "₹799",
    poster: encodeURI("/Spidy.png"),
    video: encodeURI("/spidy0001-0250.mkv"),
    color: "Black"
  },
  {
    id: 2,
    name: "Sound of Rain",
    price: "₹799",
    poster: encodeURI("/Sound of rain.png"),
    video: encodeURI("/soundofrain0001-0250.mkv"),
    color: "White"
  },
  {
    id: 3,
    name: "Shinchan Vibes",
    price: "₹799",
    poster: encodeURI("/shinchan.png"),
    video: encodeURI("/0001-0250.mkv"),
    color: "Navy"
  }
];

export const FeaturedProducts = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }[]>(products.map(() => ({ rx: 0, ry: 0 })));
  const [hovered, setHovered] = useState<boolean[]>(products.map(() => false));
  const [mobileActive, setMobileActive] = useState<boolean[]>(products.map(() => false));
  const [wishlisted, setWishlisted] = useState<boolean[]>(products.map(() => false));

  // Mobile: play the card that is centered/focused in the viewport; pause others
  useEffect(() => {
    const isTouch =
      ("ontouchstart" in window) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
    if (!isTouch) return;

    let raf = 0;
    const evaluateCenter = () => {
      const viewportCenter = window.innerHeight / 2;
      let bestIndex = -1;
      let bestDistance = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        // Consider only if at least partially visible
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
          }
        }
      });

      videoRefs.current.forEach((v, i) => {
        if (!v) return;
        if (i === bestIndex) {
          v.muted = true;
          v.play().catch(() => {});
          setMobileActive((prev) => prev.map((val, idx) => (idx === i ? true : false)));
        } else {
          v.pause();
          v.currentTime = 0;
          setMobileActive((prev) => prev.map((val, idx) => (idx === i ? false : val)));
        }
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(evaluateCenter);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // initial
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onScroll as any);
    };
  }, []);

  const handleHoverPlay = (index: number) => {
    const v = videoRefs.current[index];
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
    setHovered((prev) => prev.map((h, i) => (i === index ? true : h)));
  };

  const handleHoverPause = (index: number) => {
    const v = videoRefs.current[index];
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setTilt((prev) => prev.map((t, i) => (i === index ? { rx: 0, ry: 0 } : t)));
    setHovered((prev) => prev.map((h, i) => (i === index ? false : h)));
  };

  const handleTilt = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const ry = ((x - midX) / midX) * 6; // rotateY by horizontal position
    const rx = -((y - midY) / midY) * 6; // rotateX by vertical position
    setTilt((prev) => prev.map((t, i) => (i === index ? { rx, ry } : t)));
  };
  
  return (
    <section id="products" ref={sectionRef as any} className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-foreground">Featured </span>
            <span className="text-primary">Collection</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked designs that capture the GenZ aesthetic. 
            Minimalist, bold, and ready to make a statement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <Card 
              key={product.id}
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-smooth shadow-card bg-card/50 backdrop-blur-sm cursor-pointer transform-gpu hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div
                className="relative aspect-square overflow-hidden bg-muted/20 will-change-transform"
                onMouseEnter={() => handleHoverPlay(index)}
                onMouseLeave={() => handleHoverPause(index)}
                onMouseMove={(e) => handleTilt(index, e)}
                style={{
                  perspective: "1000px",
                  transform: `perspective(1000px) rotateX(${tilt[index]?.rx || 0}deg) rotateY(${tilt[index]?.ry || 0}deg)`
                }}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
              >
                <img
                  src={product.poster}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: hovered[index] || mobileActive[index] ? 0 : 1 }}
                />
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[index] = el;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
                  poster={product.poster}
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  src={product.video}
                  style={{ opacity: hovered[index] || mobileActive[index] ? 1 : 0 }}
                />
                {wishlisted[index] && (
                  <div className="absolute top-3 right-3">
                    <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                  </div>
                )}
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.color} • Oversized Fit</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {product.price}
                  </span>
                  <Button 
                    className="gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishlisted((prev) => prev.map((w, i) => (i === index ? true : w)));
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="border-primary/30 text-foreground hover:bg-primary/10 transition-smooth"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};
