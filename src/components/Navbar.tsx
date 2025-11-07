import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { count } = useCart();

  const scrollToSection = (sectionId: string) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      // Delay to allow home page to render before scrolling
      setTimeout(doScroll, 50);
    } else {
      doScroll();
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            Khichik
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("home")} className="text-foreground hover:text-primary transition-smooth">
              Home
            </button>
            <button onClick={() => scrollToSection("customize")} className="text-foreground hover:text-primary transition-smooth">
              Customize
            </button>
            <button onClick={() => scrollToSection("products")} className="text-foreground hover:text-primary transition-smooth">
              Products
            </button>
            <button onClick={() => scrollToSection("about")} className="text-foreground hover:text-primary transition-smooth">
              About
            </button>
            <Button variant="outline" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
            <button onClick={() => scrollToSection("home")} className="text-foreground text-left hover:text-primary transition-smooth">
              Home
            </button>
            <button onClick={() => scrollToSection("customize")} className="text-foreground text-left hover:text-primary transition-smooth">
              Customize
            </button>
            <button onClick={() => scrollToSection("products")} className="text-foreground text-left hover:text-primary transition-smooth">
              Products
            </button>
            <button onClick={() => scrollToSection("about")} className="text-foreground text-left hover:text-primary transition-smooth">
              About
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
