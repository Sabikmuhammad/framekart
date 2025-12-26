"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Tag, TrendingUp } from "lucide-react";

interface OfferSettings {
  _id?: string;
  name: string;
  active: boolean;
  discountType: string;
  discountValue: number;
  maxOrdersPerUser: number;
  minOrderValue: number;
  validUntil?: string;
}

export default function OffersPage() {
  const [offer, setOffer] = useState<OfferSettings>({
    name: "Launch Offer",
    active: true,
    discountType: "PERCENT",
    discountValue: 15,
    maxOrdersPerUser: 3,
    minOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOfferSettings();
  }, []);

  const fetchOfferSettings = async () => {
    try {
      const response = await fetch("/api/offers");
      const data = await response.json();

      if (data.success && data.offer) {
        setOffer({
          ...data.offer,
          validUntil: data.offer.validUntil ? new Date(data.offer.validUntil).toISOString().split('T')[0] : "",
        });
      }
    } catch (error) {
      console.error("Error fetching offer settings:", error);
      toast({
        title: "Error",
        description: "Failed to load offer settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/offers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offer),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update offer");
      }

      toast({
        title: "Success",
        description: "Offer settings updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating offer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update offer settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = () => {
    setOffer({ ...offer, active: !offer.active });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Tag className="h-7 w-7" />
          Offer Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage launch offers and promotional discounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Launch Offer Settings
          </CardTitle>
          <CardDescription>
            Configure the automatic launch discount for first-time customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Offer Name */}
          <div className="space-y-2">
            <Label htmlFor="offerName">Offer Name</Label>
            <Input
              id="offerName"
              type="text"
              value={offer.name}
              onChange={(e) =>
                setOffer({ ...offer, name: e.target.value })
              }
              placeholder="e.g., Launch Offer, New Year Sale"
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground">
              The name of your promotional offer (displayed to customers)
            </p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-base font-semibold">Offer Status</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {offer.active ? "Offer is currently active" : "Offer is currently disabled"}
              </p>
            </div>
            <Button
              onClick={handleToggle}
              variant={offer.active ? "default" : "outline"}
              className="min-w-[100px]"
            >
              {offer.active ? "Active" : "Disabled"}
            </Button>
          </div>

          {/* Discount Value */}
          <div className="space-y-2">
            <Label htmlFor="discountValue">Discount Percentage (%)</Label>
            <Input
              id="discountValue"
              type="number"
              value={offer.discountValue}
              onChange={(e) =>
                setOffer({ ...offer, discountValue: Number(e.target.value) })
              }
              min="0"
              max="100"
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Customers will get {offer.discountValue}% off their order
            </p>
          </div>

          {/* Max Orders Per User */}
          <div className="space-y-2">
            <Label htmlFor="maxOrders">Maximum Orders Per User</Label>
            <Input
              id="maxOrders"
              type="number"
              value={offer.maxOrdersPerUser}
              onChange={(e) =>
                setOffer({ ...offer, maxOrdersPerUser: Number(e.target.value) })
              }
              min="1"
              max="10"
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Offer applies only to users with less than {offer.maxOrdersPerUser} completed orders
            </p>
          </div>

          {/* Min Order Value */}
          <div className="space-y-2">
            <Label htmlFor="minOrderValue">Minimum Order Value (₹)</Label>
            <Input
              id="minOrderValue"
              type="number"
              value={offer.minOrderValue}
              onChange={(e) =>
                setOffer({ ...offer, minOrderValue: Number(e.target.value) })
              }
              min="0"
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              {offer.minOrderValue > 0
                ? `Orders must be at least ₹${offer.minOrderValue} to qualify`
                : "No minimum order value required"}
            </p>
          </div>

          {/* Valid Until */}
          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid Until (Optional)</Label>
            <Input
              id="validUntil"
              type="date"
              value={offer.validUntil || ""}
              onChange={(e) =>
                setOffer({ ...offer, validUntil: e.target.value })
              }
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Leave empty for no expiry date
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
