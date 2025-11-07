import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, removeItem, setQuantity, total, clear } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <Card className="p-8 text-center shadow-card bg-card/50 backdrop-blur-sm">
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Button onClick={() => navigate("/")} className="gradient-primary text-primary-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4 flex gap-4 items-center shadow-card bg-card/50 backdrop-blur-sm">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.color ? `${item.color}` : ''}{item.color && item.size ? ' • ' : ''}{item.size ? `Size ${item.size}` : ''}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input value={item.quantity} onChange={(e) => setQuantity(item.id, parseInt(e.target.value || '1'))} className="w-14 text-center" />
                        <Button variant="outline" size="icon" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-semibold text-foreground">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card className="p-4 shadow-card bg-card/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
                <Button className="w-full gradient-primary text-primary-foreground">
                  <Check className="h-4 w-4 mr-2" /> Checkout
                </Button>
                <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/")}>Add another item</Button>
                <Button variant="ghost" className="w-full mt-2" onClick={() => clear()}>Clear cart</Button>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}


