"use client";

import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Package, MapPin, CreditCard, Calendar, Mail, Phone } from "lucide-react";

interface OrderDetailProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailDrawer({ order, isOpen, onClose }: OrderDetailProps) {
  if (!order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default"; // Green
      case "Shipped":
        return "default"; // Green
      case "Processing":
      case "Printed":
        return "secondary"; // Blue
      case "Pending":
        return "outline"; // Gray
      default:
        return "secondary";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>
            Order #{order._id.slice(-8).toUpperCase()}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Status
              </h3>
              <Badge variant={getStatusBadgeVariant(order.status || "Pending")}>
                {order.status || "Pending"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Payment: <span className="font-medium capitalize">{order.paymentStatus}</span>
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </p>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                {order.customerEmail}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                {order.address.phone}
              </p>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{order.address.fullName}</p>
              <p>{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
              <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Frame Info (if applicable) */}
          {order.type === "custom" && order.customFrame && (
            <>
              <div>
                <h3 className="font-semibold mb-3">Custom Frame Details</h3>
                <div className="space-y-3">
                  <img
                    src={order.customFrame.imageUrl}
                    alt="Custom frame"
                    className="w-full rounded border"
                  />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Frame Style</p>
                      <p className="font-medium">{order.customFrame.frameStyle}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Frame Size</p>
                      <p className="font-medium">{order.customFrame.frameSize}</p>
                    </div>
                  </div>
                  {order.customFrame.customerNotes && (
                    <div>
                      <p className="text-muted-foreground text-sm">Customer Notes</p>
                      <p className="text-sm mt-1">{order.customFrame.customerNotes}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" variant="outline">
              Generate Invoice
            </Button>
            <Button className="flex-1">
              Email Customer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
