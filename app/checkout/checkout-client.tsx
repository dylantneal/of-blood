"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function CheckoutClient() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "US",
    zip: "",
  });

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push("/merch");
    } else {
      refreshCart();
    }
  }, [cart, router, refreshCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;

    setIsLoading(true);
    try {
      // Create order and get checkout URL
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          shippingInfo,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to Shopify checkout
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Failed to proceed to checkout. Please try again.");
      setIsLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Checkout Form */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                required
                value={shippingInfo.email}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, email: e.target.value })
                }
              />
              <Input
                type="tel"
                placeholder="Phone (optional)"
                value={shippingInfo.phone}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
              />
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  required
                  value={shippingInfo.firstName}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                  }
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={shippingInfo.lastName}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                  }
                />
              </div>
              <Input
                type="text"
                placeholder="Address"
                required
                value={shippingInfo.address1}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address1: e.target.value })
                }
              />
              <Input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={shippingInfo.address2}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address2: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="City"
                  required
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                />
                <Input
                  type="text"
                  placeholder="State/Province"
                  required
                  value={shippingInfo.province}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, province: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="ZIP/Postal Code"
                  required
                  value={shippingInfo.zip}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, zip: e.target.value })
                  }
                />
                <select
                  required
                  value={shippingInfo.country}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, country: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-line rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Payment"
            )}
          </Button>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="p-6 sticky top-24">
          <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-line">
                <div className="relative w-16 h-16 bg-muted rounded-sm flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gold/30 text-xs">
                      OB
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-sm text-foreground/60">{item.variantTitle}</p>
                  <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                </div>
                <p className="text-gold font-mono">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-6 pt-4 border-t border-line">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(cart.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-foreground/60">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-line">
            <span className="font-display text-lg font-semibold">Total</span>
            <span className="text-gold font-mono text-xl font-bold">
              {formatPrice(cart.totalAmount)}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

