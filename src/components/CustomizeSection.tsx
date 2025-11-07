import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Check, Loader2, ShoppingCart } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { TShirtDesigner } from "@/components/TShirtDesigner";
import { saveDesignToUploads, type DesignData } from "@/utils/fileStorage";

export const CustomizeSection = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#e6e6eb");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const price = 599;

  const colors = [
    { name: "Black", value: "#0b0b0f" },
    { name: "White", value: "#e6e6eb" },
    { name: "Navy", value: "#1e2a44" },
    { name: "Maroon", value: "#6d1b1b" },
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setProcessedImage(null);
      
      try {
        // Create a URL for the file
        const originalUrl = URL.createObjectURL(file);
        setUploadedImage(originalUrl);
        
        try {
          // Use the background removal library directly with the file
          const blob = await removeBackground(file, {
            output: {
              format: 'image/png',
              quality: 1
            },
            model: 'isnet_fp16',
            progress: (key, current, total) => {
              console.log(`Processing: ${key} - ${current}/${total}`);
            }
          });
          
          // Convert blob to data URL to ensure proper transparency
          const reader = new FileReader();
          reader.onloadend = () => {
            setProcessedImage(reader.result as string);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.warn('Background removal failed, using original image:', error);
          setProcessedImage(originalUrl);
        } finally {
          setIsProcessing(false);
        }
      } catch (error) {
        console.warn('Image processing failed:', error);
        // Fallback to file reader approach
        const reader = new FileReader();
        reader.onloadend = () => {
          const originalImage = reader.result as string;
          setUploadedImage(originalImage);
          setProcessedImage(originalImage);
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Check if all required fields are filled
  const isAddToCartDisabled = useMemo(() => {
    return !uploadedImage || !selectedSize || !selectedColor;
  }, [uploadedImage, selectedSize, selectedColor]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (isAddToCartDisabled) return;

    setIsAddingToCart(true);
    setAddToCartSuccess(false);

    try {
      // Create design data object
      const designData: DesignData = {
        id: `custom-${Date.now()}`,
        uploadedImage: uploadedImage,
        processedImage: processedImage,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        price: price,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Save design to uploads folder
      await saveDesignToUploads(designData);

      // Show success feedback
      setAddToCartSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setAddToCartSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to save design:', error);
      alert('Failed to save design. Please try again or contact support.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <section id="customize" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-primary">Design Your Own</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your artwork, choose color and size, and see a live preview.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Upload Area */}
            <Card className="p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-smooth shadow-card bg-card/50 backdrop-blur-sm">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground">Upload Your Design</h3>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf,.svg"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isProcessing}
                    ref={fileInputRef}
                  />
                  {isProcessing ? (
                    <div className="text-center space-y-3">
                      <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
                      <div>
                        <p className="text-foreground font-medium">Processing image...</p>
                        <p className="text-xs text-muted-foreground">Removing background</p>
                      </div>
                    </div>
                  ) : uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded design" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center space-y-3">
                      <Upload className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-smooth" />
                      <div>
                        <p className="text-foreground font-medium">Click to upload</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, SVG or PDF (Max 10MB)</p>
                        <p className="text-xs text-muted-foreground">Recommended: 300 DPI, 12" x 16"</p>
                        <p className="text-xs text-primary">✨ Background will be auto-removed</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button className="w-full gradient-primary text-primary-foreground hover:shadow-glow transition-smooth" size="lg" onClick={() => fileInputRef.current?.click()} type="button">
                  {uploadedImage ? "Update Design" : "Choose File"}
                </Button>
              </div>
            </Card>

            {/* Mobile: Live Preview directly under upload card */}
            <div className="md:hidden">
              <Card className="overflow-hidden shadow-card bg-card/50 backdrop-blur-sm">
                <div className="p-4">
                  <TShirtDesigner 
                    designImage={processedImage || uploadedImage} 
                    shirtColor={selectedColor}
                    isProcessing={isProcessing}
                  />
                </div>
              </Card>
            </div>

            {/* Color Picker */}
            <Card className="p-6 shadow-card bg-card/50 backdrop-blur-sm">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Choose T-Shirt Color</h4>
                <div className="flex items-center gap-4">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedColor(c.value)}
                      aria-label={c.name}
                      className={`w-10 h-10 rounded-full border-2 transition-smooth ${
                        selectedColor === c.value ? "border-primary shadow-glow" : "border-border/50"
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Size Picker */}
            <Card className="p-6 shadow-card bg-card/50 backdrop-blur-sm">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Select Size</h4>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 rounded-md border-2 transition-smooth min-w-[60px] ${
                        selectedSize === sz
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/50 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Total + Add to Cart */}
            <Card className="p-6 shadow-card bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-bold text-primary">₹{price}</div>
              </div>
              <Button
                size="lg"
                disabled={isAddToCartDisabled || isAddingToCart}
                onClick={handleAddToCart}
                className="mt-4 w-full gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Design...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              {/* Validation messages */}
              {!uploadedImage && (
                <p className="mt-2 text-xs text-muted-foreground">Upload a design to continue</p>
              )}
              {uploadedImage && !selectedSize && (
                <p className="mt-2 text-xs text-muted-foreground">Select a size to continue</p>
              )}
              {uploadedImage && selectedSize && !selectedColor && (
                <p className="mt-2 text-xs text-muted-foreground">Select a color to continue</p>
              )}
              
              {/* Success message */}
              {addToCartSuccess && (
                <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-md">
                  <p className="text-xs text-green-700 flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Design saved successfully! Ready for printing.
                  </p>
                </div>
              )}
              
              <p className="mt-3 text-[11px] text-muted-foreground">3-5 business days for printing + shipping</p>
            </Card>
          </div>

          {/* Right: Live Preview + Guidelines */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-card bg-card/50 backdrop-blur-sm hidden md:block">
              <div className="p-4">
                <TShirtDesigner 
                  designImage={processedImage || uploadedImage} 
                  shirtColor={selectedColor}
                  isProcessing={isProcessing}
                />
              </div>
            </Card>

            <Card className="p-6 shadow-card bg-card/50 backdrop-blur-sm">
              <h4 className="font-semibold text-foreground mb-2">Design Guidelines</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Minimum 300 DPI for best quality</li>
                <li>Keep important elements away from edges</li>
                <li>Use high contrast colors for visibility</li>
                <li>Ensure you own copyright to the design</li>
                <li className="text-primary">✨ Background will be automatically removed</li>
                <li className="text-primary">🎯 Drag, rotate & resize your design interactively</li>
                <li className="text-primary">📍 Design stays within printable area automatically</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Why Choose Custom - keep existing selling points */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground">Why Choose Custom?</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "100% Your Design", description: "Upload any image, artwork, or photo you want on your tee" },
              { title: "Premium Quality Print", description: "High-resolution printing that lasts wash after wash" },
              { title: "Oversized Fit", description: "GenZ-approved oversized tees for that perfect aesthetic" },
              { title: "Fast Delivery", description: "Delivered across India within 5-7 working days" },
              { title: "Affordable Pricing", description: "Quality custom tees at prices that won't break the bank" },
              { title: "Satisfaction Guaranteed", description: "We stand by our promises - quality you can trust" },
            ].map((feature, index) => (
              <Card key={index} className="p-4 border border-border/50 hover:border-primary/50 transition-smooth shadow-card bg-card/50 backdrop-blur-sm group">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center group-hover:shadow-glow transition-smooth">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
