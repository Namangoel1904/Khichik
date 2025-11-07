import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, ShoppingCart, Truck, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Using homepage media assets (videos with posters) from public/

const products = [
  {
    id: "1",
    name: "Spidey Motion",
    price: "₹799",
    media: [
      { poster: encodeURI("/Spidy.png"), video: encodeURI("/spidy0001-0250.mkv") },
      { poster: encodeURI("/Spidy.png"), video: encodeURI("/spidy0001-0250.mkv") },
      { poster: encodeURI("/Spidy.png"), video: encodeURI("/spidy0001-0250.mkv") }
    ],
    colors: ["Black", "White", "Navy"],
    description: "Premium oversized tee with dynamic Spidey-inspired motion art."
  },
  {
    id: "2",
    name: "Sound of Rain",
    price: "₹799",
    media: [
      { poster: encodeURI("/Sound of rain.png"), video: encodeURI("/soundofrain0001-0250.mkv") },
      { poster: encodeURI("/Sound of rain.png"), video: encodeURI("/soundofrain0001-0250.mkv") },
      { poster: encodeURI("/Sound of rain.png"), video: encodeURI("/soundofrain0001-0250.mkv") }
    ],
    colors: ["White", "Black", "Grey"],
    description: "Ambient rain-inspired visual for calm, moody aesthetics."
  },
  {
    id: "3",
    name: "Shinchan Vibes",
    price: "₹799",
    media: [
      { poster: encodeURI("/shinchan.png"), video: encodeURI("/0001-0250.mkv") },
      { poster: encodeURI("/shinchan.png"), video: encodeURI("/0001-0250.mkv") },
      { poster: encodeURI("/shinchan.png"), video: encodeURI("/0001-0250.mkv") }
    ],
    colors: ["Navy", "Black", "Purple"],
    description: "Playful Shinchan motion graphic on premium oversized fit."
  }
];

const sizes = ["S", "M", "L", "XL", "XXL"];
const sizeChart = [
  { size: "S", chest: "38", length: "27" },
  { size: "M", chest: "40", length: "28" },
  { size: "L", chest: "42", length: "29" },
  { size: "XL", chest: "44", length: "30" },
  { size: "XXL", chest: "46", length: "31" }
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = products.find(p => p.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hover, setHover] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch = ("ontouchstart" in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
    setIsTouch(!!touch);
  }, []);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const { addItem } = useCart();

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
  };

  const handleCheckDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryChecked(true);
      toast({
        title: "Delivery available",
        description: "Expected delivery in 5-6 days",
      });
    } else {
      toast({
        title: "Invalid pincode",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select size",
        description: "Select size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    // add to cart
    addItem({
      id: `p-${product.id}-${selectedSize}`,
      name: product.name,
      price: 799,
      image: product.media[selectedImage].poster,
      color: undefined,
      size: selectedSize,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} added successfully`,
    });
  };

  const otherProducts = products.filter(p => p.id !== id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Media Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted/20">
              <div 
                className="relative w-full h-full"
                onMouseEnter={() => { if (!isTouch) { setHover(true); videoRef.current?.play().catch(() => {}); } }}
                onMouseLeave={() => { if (!isTouch) { setHover(false); if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } } }}
                onClick={() => { if (isTouch && videoRef.current) { if (videoRef.current.paused) { videoRef.current.play().catch(() => {}); setHover(true); } else { videoRef.current.pause(); setHover(false); } } }}
              >
                <img
                  src={product.media[selectedImage].poster}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: hover ? 0 : 1 }}
                />
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={product.media[selectedImage].poster}
                  src={product.media[selectedImage].video}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  style={{ opacity: hover ? 1 : 0 }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.media.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-smooth ${
                    selectedImage === idx ? "border-primary" : "border-border/50"
                  }`}
                >
                  <img src={m.poster} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">{product.price}</p>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Color selection removed per requirement */}

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Size</label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-primary">Size Chart</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Size Chart (in inches)</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-4 text-foreground">Size</th>
                            <th className="text-left py-2 px-4 text-foreground">Chest</th>
                            <th className="text-left py-2 px-4 text-foreground">Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeChart.map((row) => (
                            <tr key={row.size} className="border-b border-border/50">
                              <td className="py-2 px-4 text-muted-foreground">{row.size}</td>
                              <td className="py-2 px-4 text-muted-foreground">{row.chest}</td>
                              <td className="py-2 px-4 text-muted-foreground">{row.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md border-2 transition-smooth min-w-[60px] ${
                      selectedSize === size
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Check */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex items-center gap-2 text-foreground">
                <Truck className="h-5 w-5 text-primary" />
                <span className="font-medium">Check Delivery</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleCheckDelivery}>Check</Button>
              </div>
              {deliveryChecked && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Delivery in 5-6 days</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button size="lg" onClick={handleAddToCart} className="w-full">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" className="w-full gradient-primary text-primary-foreground">
                  Buy Now
                </Button>
              </div>
              <Button variant="outline" size="lg" className="w-full" onClick={handleShare}>
                <Share2 className="h-5 w-5 mr-2" />
                Share Product
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-16 md:mt-24">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Similar <span className="text-primary">Products</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {otherProducts.map((item) => (
              <Card 
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="group overflow-hidden border-border/50 hover:border-primary/50 transition-smooth shadow-card bg-card/50 backdrop-blur-sm cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-muted/20">
                  <img 
                    src={item.media[0].poster}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{item.name}</h3>
                  <span className="text-2xl font-bold text-primary">{item.price}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
