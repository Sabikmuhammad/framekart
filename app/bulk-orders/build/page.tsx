"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Minus, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { calculateBulkPricing, BULK_MIN_QUANTITY, CUSTOM_FRAME_PRICES } from "@/lib/bulk-pricing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Frame {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface OrderItem {
  id: string;
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  type: "PRODUCT" | "CUSTOM_PHOTO" | "REGULAR";
  configuration?: {
    frameSize: string;
    frameStyle: string;
    finish: string;
  };
}

export default function BulkOrderBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialType = searchParams?.get("type") || "Wedding";
  
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loadingFrames, setLoadingFrames] = useState(true);
  
  const [orderMethod, setOrderMethod] = useState<"PRODUCT" | "UPLOAD">("PRODUCT");

  // Order State
  const [orderType, setOrderType] = useState(initialType);
  const [items, setItems] = useState<OrderItem[]>([]);
  
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [organisation, setOrganisation] = useState({ name: "", gstNumber: "", designation: "" });
  const [delivery, setDelivery] = useState({ addressLine1: "", area: "", city: "", state: "", pincode: "" });
  const [requiredDate, setRequiredDate] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch("/api/frames")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setFrames(data.data);
        setLoadingFrames(false);
      })
      .catch(err => {
        console.error("Failed to fetch frames:", err);
        setLoadingFrames(false);
      });
  }, []);

  const pricing = useMemo(() => calculateBulkPricing(items), [items]);

  const handleAddProduct = (frame: Frame) => {
    const existing = items.find(i => i.productId === frame._id && i.type === "PRODUCT");
    if (existing) {
      setItems(items.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + BULK_MIN_QUANTITY } : i));
    } else {
      setItems([...items, {
        id: `prod_${frame._id}_${Date.now()}`,
        productId: frame._id,
        title: frame.title,
        price: frame.price,
        quantity: BULK_MIN_QUANTITY,
        imageUrl: frame.imageUrl,
        type: "PRODUCT"
      }]);
    }
    toast({ title: "Added to Bulk Order" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newItems: OrderItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        toast({ title: "Invalid file", description: `${file.name} is not a supported format.`, variant: "destructive" });
        continue;
      }
      
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        
        if (data.success) {
          newItems.push({
            id: `custom_${Date.now()}_${i}`,
            title: file.name,
            price: CUSTOM_FRAME_PRICES["A4"],
            quantity: BULK_MIN_QUANTITY,
            imageUrl: data.data.secure_url,
            type: "CUSTOM_PHOTO",
            configuration: {
              frameSize: "A4",
              frameStyle: "Black",
              finish: "Matte"
            }
          });
        }
      } catch (err) {
        toast({ title: "Upload failed", description: `Could not upload ${file.name}.`, variant: "destructive" });
      }
    }

    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
      toast({ title: "Photos added successfully" });
    }
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };
  
  const handleSetQuantity = (id: string, val: string) => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) return;
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(1, parsed) } : i));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleConfigChange = (id: string, key: string, value: string) => {
    setItems(items.map(i => {
      if (i.id === id && i.type === "CUSTOM_PHOTO") {
        const newConfig = { ...i.configuration, [key]: value };
        let newPrice = i.price;
        if (key === 'frameSize') {
          newPrice = CUSTOM_FRAME_PRICES[value] || i.price;
        }
        return { ...i, configuration: newConfig as any, price: newPrice };
      }
      return i;
    }));
  };

  const handleSubmit = async (isQuoteRequest: boolean) => {
    if (items.length === 0) {
      toast({ title: "Cart empty", description: "Please add at least one product.", variant: "destructive" });
      return;
    }
    
    if (pricing.totalQuantity < BULK_MIN_QUANTITY) {
      toast({ title: "Minimum quantity not met", description: `Bulk orders require a minimum of ${BULK_MIN_QUANTITY} total units.`, variant: "destructive" });
      return;
    }

    if (!customer.firstName || !customer.phone || !customer.email || !delivery.addressLine1 || !delivery.city || !delivery.state || !delivery.pincode) {
      toast({ title: "Missing details", description: "Please fill in all required customer and delivery fields.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    if (!isQuoteRequest) setIsCheckout(true);

    try {
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer,
          organisation,
          delivery,
          orderType,
          requiredDate: requiredDate ? new Date(requiredDate) : undefined,
          specialInstructions,
          isQuoteRequest
        })
      });
      
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error || "Failed to submit");
      
      const orderId = data.data._id;
      
      if (isQuoteRequest || data.wasForcedToQuote) {
        toast({ title: "Quote Requested", description: data.wasForcedToQuote ? "Your volume requires a custom quote. We have submitted your request." : "Your bulk quote request has been received. We will contact you shortly." });
        router.push("/bulk-orders/success?type=quote&id=" + orderId);
      } else {
        const cfRes = await fetch("/api/cashfree/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: pricing.finalTotal,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            customerName: customer.firstName,
            orderId: orderId,
            orderType: "bulk"
          })
        });
        
        const cfData = await cfRes.json();
        if (cfData.success && cfData.payment_session_id) {
          toast({ title: "Proceeding to payment..." });
          window.location.href = `/api/cashfree/callback?db_order_id=${orderId}&order_id=mock_cf_${Date.now()}&type=bulk`;
        } else {
          throw new Error("Payment initialization failed");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setIsCheckout(false);
    }
  };

  const productItems = items.filter(i => i.type === "PRODUCT" || i.type === "REGULAR");
  const customItems = items.filter(i => i.type === "CUSTOM_PHOTO");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <button onClick={() => router.back()} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Build Your Bulk Order</h1>
            
            <Card className="border-gray-200 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gray-900 p-6 text-white text-center">
                  <h2 className="text-xl font-medium mb-1">How would you like to order?</h2>
                  <p className="text-gray-400 text-sm">Combine both options to create the perfect bulk package.</p>
                </div>
                <div className="flex flex-col sm:flex-row p-4 gap-4 bg-white">
                  <button 
                    onClick={() => setOrderMethod("PRODUCT")}
                    className={`flex-1 p-6 border rounded-xl flex flex-col items-center transition-all ${orderMethod === "PRODUCT" ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <ImageIcon className={`h-8 w-8 mb-3 ${orderMethod === "PRODUCT" ? "text-primary" : "text-gray-400"}`} />
                    <span className="font-semibold">FrameKart Products</span>
                    <span className="text-xs text-gray-500 mt-1">Choose from our existing collection</span>
                  </button>
                  <button 
                    onClick={() => setOrderMethod("UPLOAD")}
                    className={`flex-1 p-6 border rounded-xl flex flex-col items-center transition-all ${orderMethod === "UPLOAD" ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <Upload className={`h-8 w-8 mb-3 ${orderMethod === "UPLOAD" ? "text-primary" : "text-gray-400"}`} />
                    <span className="font-semibold">Upload Your Photos</span>
                    <span className="text-xs text-gray-500 mt-1">Bring your own photos or designs</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence mode="wait">
              {orderMethod === "PRODUCT" && (
                <motion.div key="product" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">1</span>
                        Select Products
                      </h2>
                      
                      {loadingFrames ? (
                        <div className="h-32 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-64 overflow-y-auto p-1 pr-2 custom-scrollbar">
                          {frames.map(frame => (
                            <div key={frame._id} className="border rounded-lg p-2 flex flex-col hover:border-primary cursor-pointer transition-colors" onClick={() => handleAddProduct(frame)}>
                              <div className="aspect-square bg-gray-100 rounded mb-2 relative overflow-hidden">
                                {frame.imageUrl && <Image src={frame.imageUrl} alt={frame.title} fill className="object-cover" />}
                              </div>
                              <h3 className="text-xs font-medium line-clamp-1 mb-1">{frame.title}</h3>
                              <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs font-bold text-gray-900">{formatPrice(frame.price)}</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-primary/10 hover:bg-primary hover:text-white"><Plus className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {orderMethod === "UPLOAD" && (
                <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">1</span>
                        Upload Photos
                      </h2>
                      
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                        {isUploading ? (
                          <div className="flex flex-col items-center text-primary">
                            <Loader2 className="h-10 w-10 animate-spin mb-3" />
                            <span className="font-medium">Uploading your photos...</span>
                          </div>
                        ) : (
                          <>
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <Upload className="h-6 w-6 text-gray-500" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-lg">Click or drag photos here</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">Upload multiple files. Supported formats: JPG, PNG, WEBP.</p>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {items.length > 0 && (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  
                  {productItems.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">FrameKart Products</h3>
                      {productItems.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 border rounded-xl shadow-sm">
                          <div className="h-16 w-16 bg-gray-100 rounded-md relative shrink-0 overflow-hidden">
                            {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-500">{formatPrice(item.price)} per unit</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                              <button onClick={() => handleUpdateQuantity(item.id, -10)} className="px-2 py-1.5 hover:bg-gray-50 text-gray-500"><Minus className="h-4 w-4" /></button>
                              <input type="number" value={item.quantity} onChange={(e) => handleSetQuantity(item.id, e.target.value)} className="w-16 text-center text-sm font-medium border-x py-1.5 focus:outline-none" />
                              <button onClick={() => handleUpdateQuantity(item.id, 10)} className="px-2 py-1.5 hover:bg-gray-50 text-gray-500"><Plus className="h-4 w-4" /></button>
                            </div>
                            <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {customItems.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider border-t pt-4">Custom Uploads</h3>
                      {customItems.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-white p-4 border rounded-xl shadow-sm">
                          <div className="h-24 w-24 bg-gray-100 rounded-md relative shrink-0 overflow-hidden">
                            {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1" title={item.title}>{item.title}</h4>
                                <p className="text-sm font-medium text-primary mt-0.5">{formatPrice(item.price)} per unit</p>
                              </div>
                              <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              <Select value={item.configuration?.frameSize} onValueChange={(val) => handleConfigChange(item.id, 'frameSize', val)}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Size" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A4">A4 (21x29.7cm)</SelectItem>
                                  <SelectItem value="12x18">A3 (12x18&quot;)</SelectItem>
                                  <SelectItem value="18x24">A2 (18x24&quot;)</SelectItem>
                                  <SelectItem value="24x36">A1 (24x36&quot;)</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Select value={item.configuration?.frameStyle} onValueChange={(val) => handleConfigChange(item.id, 'frameStyle', val)}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Style" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Black">Black</SelectItem>
                                  <SelectItem value="White">White</SelectItem>
                                  <SelectItem value="Wooden">Wooden</SelectItem>
                                  <SelectItem value="Golden">Golden</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Select value={item.configuration?.finish} onValueChange={(val) => handleConfigChange(item.id, 'finish', val)}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Finish" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Matte">Matte</SelectItem>
                                  <SelectItem value="Satin">Satin</SelectItem>
                                  <SelectItem value="Gloss">Gloss</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center gap-3 pt-1">
                              <span className="text-xs font-medium text-gray-500">Qty:</span>
                              <div className="flex items-center border rounded-md overflow-hidden bg-white h-8">
                                <button onClick={() => handleUpdateQuantity(item.id, -10)} className="px-2 hover:bg-gray-50 text-gray-500"><Minus className="h-3 w-3" /></button>
                                <input type="number" value={item.quantity} onChange={(e) => handleSetQuantity(item.id, e.target.value)} className="w-12 text-center text-xs font-medium border-x focus:outline-none h-full" />
                                <button onClick={() => handleUpdateQuantity(item.id, 10)} className="px-2 hover:bg-gray-50 text-gray-500"><Plus className="h-3 w-3" /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </CardContent>
              </Card>
            )}

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">2</span>
                  Details & Delivery
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4 text-sm text-gray-500 uppercase">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input value={customer.firstName} onChange={e => setCustomer({...customer, firstName: e.target.value})} placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input value={customer.lastName} onChange={e => setCustomer({...customer, lastName: e.target.value})} placeholder="Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label>Mobile Number *</Label>
                        <Input value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} placeholder="9876543210" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} placeholder="john@company.com" type="email" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4 text-sm text-gray-500 uppercase">Organisation (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company / Organisation Name</Label>
                        <Input value={organisation.name} onChange={e => setOrganisation({...organisation, name: e.target.value})} placeholder="Acme Corp" />
                      </div>
                      <div className="space-y-2">
                        <Label>GST Number</Label>
                        <Input value={organisation.gstNumber} onChange={e => setOrganisation({...organisation, gstNumber: e.target.value})} placeholder="29ABCDE1234F1Z5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4 text-sm text-gray-500 uppercase">Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Address Line 1 *</Label>
                        <Input value={delivery.addressLine1} onChange={e => setDelivery({...delivery, addressLine1: e.target.value})} placeholder="Flat / Building / Street" />
                      </div>
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input value={delivery.city} onChange={e => setDelivery({...delivery, city: e.target.value})} placeholder="Mumbai" />
                      </div>
                      <div className="space-y-2">
                        <Label>State *</Label>
                        <Input value={delivery.state} onChange={e => setDelivery({...delivery, state: e.target.value})} placeholder="Maharashtra" />
                      </div>
                      <div className="space-y-2">
                        <Label>Pincode *</Label>
                        <Input value={delivery.pincode} onChange={e => setDelivery({...delivery, pincode: e.target.value})} placeholder="400001" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4 text-sm text-gray-500 uppercase">Order Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Order Type</Label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Wedding">Wedding</SelectItem>
                            <SelectItem value="Corporate">Corporate</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="School/College">School/College</SelectItem>
                            <SelectItem value="Personal">Personal Bulk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Required By Date (Optional)</Label>
                        <Input type="date" value={requiredDate} onChange={e => setRequiredDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Special Instructions</Label>
                      <Textarea value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} placeholder="E.g., Require individual bubble wrapping, need 3 different custom names..." />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <Card className="border-primary/20 shadow-lg overflow-hidden">
                <div className="bg-gray-900 text-white p-4">
                  <h3 className="font-bold tracking-wide">ORDER SUMMARY</h3>
                </div>
                <CardContent className="p-0">
                  
                  <div className="p-6 bg-gray-50 border-b max-h-[30vh] overflow-y-auto">
                    {productItems.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">FrameKart Products</h4>
                        {productItems.map(item => (
                          <div key={item.id} className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-700 truncate mr-2 flex-1">{item.title} ({item.quantity})</span>
                            <span className="font-medium text-gray-900 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {customItems.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Custom Photos</h4>
                        {customItems.map(item => (
                          <div key={item.id} className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-700 truncate mr-2 flex-1" title={item.title}>{item.title} ({item.quantity})</span>
                            <span className="font-medium text-gray-900 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {items.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Add products to see summary</p>}
                  </div>

                  <div className="p-6 space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Units</span>
                      <span className="font-medium text-gray-900">{pricing.totalQuantity}</span>
                    </div>
                    
                    {pricing.appliedDiscountPercentage > 0 && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-center font-medium">
                        🎉 {pricing.appliedDiscountPercentage}% Bulk Discount Unlocked!
                      </div>
                    )}
                    
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatPrice(pricing.subtotal)}</span>
                      </div>
                      
                      {pricing.bulkDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Bulk Discount</span>
                          <span className="font-medium">-{formatPrice(pricing.bulkDiscount)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="font-medium uppercase">Free</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-2 flex justify-between items-end">
                      <div>
                        <span className="block text-gray-500 text-xs uppercase mb-1">Final Total</span>
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(pricing.finalTotal)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-0 space-y-3 bg-white">
                    <Button 
                      className="w-full h-12 text-base shadow-md" 
                      onClick={() => handleSubmit(false)}
                      disabled={isSubmitting || items.length === 0}
                    >
                      {isCheckout && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Checkout Now
                    </Button>
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-medium">OR</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 text-base"
                      onClick={() => handleSubmit(true)}
                      disabled={isSubmitting || items.length === 0}
                    >
                      {isSubmitting && !isCheckout && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Request Quote
                    </Button>
                    <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                      For extreme high volumes ({">"}500) or complex customisation, request a quote for tailored pricing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
