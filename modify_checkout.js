const fs = require('fs');
const path = './app/checkout/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace imports
content = content.replace(
  `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`,
  `import { motion, AnimatePresence } from "framer-motion";\nimport { CartMarquee } from "@/components/cart/CartMarquee";\nimport { CartBenefits } from "@/components/cart/CartBenefits";`
);

content = content.replace(
  `import { Tag, MapPin, Building2, Home, Loader2, AlertCircle, CheckCircle2, Plus, Trash2, Check } from "lucide-react";`,
  `import { Tag, MapPin, Building2, Home, Loader2, AlertCircle, CheckCircle2, Plus, Trash2, Check, ShieldCheck, ArrowRight, Truck } from "lucide-react";`
);

// 2. Add smart scrolling
const oldValidation = `    // Validate required fields
    if (!formData.email || !formData.fullName || !formData.phone || !formData.addressLine1 || 
        !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including email",
        variant: "destructive",
      });
      return;
    }`;
const newValidation = `    // Validate required fields
    if (!formData.email || !formData.fullName || !formData.phone || !formData.addressLine1 || 
        !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including email",
        variant: "destructive",
      });
      
      setTimeout(() => {
        const firstInvalid = document.querySelector('.border-red-400, :invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
      }, 50);
      return;
    }`;
content = content.replace(oldValidation, newValidation);

// 3. Replace return block
const returnIndex = content.lastIndexOf('  return (');
if (returnIndex !== -1) {
  const newReturn = `  return (
    <div className="min-h-screen pb-24 lg:pb-12 bg-background">
      {/* Premium Header */}
      <div className="pt-8 sm:pt-12 px-4 text-center">
        <motion.p 
          className="text-xs font-semibold tracking-[0.2em] text-primary/80 uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SECURE CHECKOUT
        </motion.p>
        <motion.h1 
          className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Complete your order
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Almost there. Complete your details and we'll prepare your {items.length} {items.length === 1 ? 'frame' : 'frames'} for delivery.
        </motion.p>
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="flex items-center justify-center gap-4 text-xs font-medium tracking-widest uppercase mb-8 sm:mb-16 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-foreground">01 Delivery Details</span>
        <span className="w-8 h-px bg-border"></span>
        <span className={paymentInitiated ? "text-foreground" : ""}>02 Payment</span>
      </motion.div>

      <CartMarquee />

      <div className="container max-w-[1200px] mx-auto px-4 mt-8 sm:mt-16">
        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12 relative items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            
            <motion.div 
              className="mb-8 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-medium tracking-wide">DELIVERY DETAILS</h2>
                <p className="text-sm text-muted-foreground">Where should we deliver your order?</p>
              </div>
            </motion.div>

            {/* Saved Addresses Section */}
            {savedAddresses.length > 0 && (
              <motion.div 
                className="mb-10 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="grid gap-3">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => handleAddressSelect(address._id)}
                      className={\`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 \${
                        selectedAddressId === address._id
                          ? 'bg-primary/[0.03] border border-primary/20 shadow-sm'
                          : 'bg-secondary/10 border border-transparent hover:bg-secondary/30'
                      }\`}
                    >
                      {/* Selection Indicator */}
                      {selectedAddressId === address._id && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                      
                      <div className="pr-12">
                        <p className="font-medium text-base mb-1">{address.fullName}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {address.addressLine1}, {address.addressLine2}
                          {address.landmark && \`, \${address.landmark}\`}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          Phone: {address.phone}
                        </p>
                        {address.isDefault && (
                          <span className="inline-block mt-3 px-2 py-1 bg-secondary/50 text-foreground text-xs font-medium tracking-wide rounded-md">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address._id);
                        }}
                        className="absolute bottom-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {!showNewAddressForm && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewAddressForm(true);
                      setSelectedAddressId("");
                      setFormData({
                        email: user?.email || "",
                        fullName: user?.name || "",
                        phone: "",
                        addressLine1: "",
                        addressLine2: "",
                        landmark: "",
                        city: "",
                        state: "",
                        pincode: "",
                      });
                    }}
                    className="w-full h-14 rounded-xl border-dashed hover:bg-secondary/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                )}
              </motion.div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <motion.div 
                className="space-y-6 sm:space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {savedAddresses.length > 0 && (
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <h3 className="text-base font-medium">New Address</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNewAddressForm(false);
                        if (savedAddresses.length > 0) {
                          handleAddressSelect(savedAddresses[0]._id);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                <div className="grid gap-6">
                  {/* Email */}
                  <div className="grid gap-2 relative">
                    <Label htmlFor="email" className="text-sm font-medium ml-1">
                      Email Address <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                      disabled={!!user?.email}
                      className={\`h-12 sm:h-14 rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary \${formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\\.[^\s@]+$/) ? "border-red-400 bg-red-50/50 dark:bg-red-950/10" : ""}\`}
                    />
                    <AnimatePresence>
                      {formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\\.[^\s@]+$/) && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className="flex items-center gap-1.5 mt-1 ml-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          <p className="text-xs text-red-500 font-medium">Valid email required</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Full Name & Phone */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-2 relative">
                      <Label htmlFor="fullName" className="text-sm font-medium ml-1">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="h-12 sm:h-14 rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="grid gap-2 relative">
                      <Label htmlFor="phone" className="text-sm font-medium ml-1">
                        Phone Number <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        required
                        className={\`h-12 sm:h-14 rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary \${formData.phone && formData.phone.length !== 10 ? "border-red-400 bg-red-50/50 dark:bg-red-950/10" : ""}\`}
                      />
                      <AnimatePresence>
                        {formData.phone && formData.phone.length !== 10 && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-1.5 mt-1 ml-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            <p className="text-xs text-red-500 font-medium">10 digits required</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div className="grid gap-2 relative">
                    <Label htmlFor="addressLine1" className="text-sm font-medium ml-1">
                      House/Flat No., Building Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      autoComplete="address-line1"
                      placeholder="e.g., Flat 101, Om Sai Apartments"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      required
                      className={\`h-12 sm:h-14 rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary \${formData.addressLine1 !== undefined && formData.addressLine1.trim().length === 0 ? "border-red-400 bg-red-50/50 dark:bg-red-950/10" : ""}\`}
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="grid gap-2 relative">
                    <Label htmlFor="addressLine2" className="text-sm font-medium ml-1">
                      Road/Street, Area, Colony <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      autoComplete="address-line2"
                      placeholder="e.g., MG Road, Koramangala"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      required
                      className="h-12 sm:h-14 rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Landmark */}
                  <div className="grid gap-2">
                    <Label htmlFor="landmark" className="text-sm font-medium ml-1 text-muted-foreground">
                      Landmark (Optional)
                    </Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      placeholder="e.g., Near City Mall"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="h-12 sm:h-14 rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Pincode, City, State */}
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-2 relative">
                      <Label htmlFor="pincode" className="text-sm font-medium ml-1">
                        Pincode <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="pincode"
                          name="pincode"
                          type="text"
                          autoComplete="postal-code"
                          placeholder="6 digits"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          onBlur={handlePincodeBlur}
                          maxLength={6}
                          pattern="[0-9]{6}"
                          required
                          className={\`h-12 sm:h-14 rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary pr-10 \${pincodeError ? 'border-red-400 bg-red-50/50 dark:bg-red-950/10' : pincodeValid ? 'border-primary/50 bg-primary/5' : ''}\`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {pincodeLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                          {!pincodeLoading && pincodeValid && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {pincodeError && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-1.5 mt-1 ml-1 absolute -bottom-6"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            <p className="text-xs text-red-500 font-medium whitespace-nowrap">{pincodeError}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="city" className="text-sm font-medium ml-1">
                        City <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        autoComplete="address-level2"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        readOnly={pincodeValid}
                        className={\`h-12 sm:h-14 rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary \${pincodeValid ? 'bg-primary/5 border-primary/20 text-muted-foreground' : ''}\`}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="state" className="text-sm font-medium ml-1">
                        State <span className="text-red-400">*</span>
                      </Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                        disabled={pincodeValid}
                        required
                      >
                        <SelectTrigger id="state" className={\`h-12 sm:h-14 rounded-xl transition-all duration-250 \${pincodeValid ? 'bg-primary/5 border-primary/20 text-muted-foreground' : ''}\`}>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  <div className="grid gap-2 mt-4">
                    <Label htmlFor="deliveryNotes" className="text-sm font-medium ml-1 text-muted-foreground">
                      Delivery Instructions (Optional)
                    </Label>
                    <Textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      placeholder="Special instructions..."
                      className="min-h-[100px] rounded-xl resize-none transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Save Address Checkbox */}
                  <div 
                    onClick={() => setSaveAddress(!saveAddress)}
                    className={\`mt-4 flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none \${
                      saveAddress 
                        ? 'border-primary bg-primary/[0.03]' 
                        : 'border-border/50 bg-transparent hover:bg-secondary/20'
                    }\`}
                  >
                    <div className={\`w-5 h-5 rounded flex items-center justify-center transition-colors \${
                      saveAddress ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30'
                    }\`}>
                      {saveAddress && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-medium">Save this address for future orders</span>
                  </div>

                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              className="lg:sticky lg:top-28 bg-secondary/10 sm:bg-transparent rounded-3xl p-6 sm:p-8 sm:border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-medium tracking-wide mb-6">YOUR ORDER</h2>
              
              <div className="space-y-4 mb-8">
                {items.map((item, i) => (
                  <motion.div 
                    key={item._id} 
                    className="flex gap-4 items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    {item.imageUrl && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary/30 shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4 text-sm border-t border-border/50 pt-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <AnimatePresence>
                  {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                    <motion.div 
                      className="flex justify-between text-primary"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Tag className="w-4 h-4" />
                        {eligibility.offerName}
                      </span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <motion.span 
                    className="text-primary font-medium flex items-center gap-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <Truck className="w-4 h-4" />
                    FREE
                  </motion.span>
                </div>
                
                <div className="border-t border-border/50 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-base tracking-wider">TOTAL</span>
                    <AnimatePresence mode="popLayout">
                      <motion.span 
                        key={total}
                        className="text-2xl font-light"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {formatPrice(total)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                      <motion.p 
                        className="text-xs text-primary/80 font-medium text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        You save {formatPrice(discount)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {!isFormValid && (
                <motion.div 
                  className="mt-6 p-4 bg-secondary/30 rounded-xl text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  <p className="text-xs text-muted-foreground font-medium">
                    Complete delivery details to proceed
                  </p>
                </motion.div>
              )}

              <Button
                onClick={handlePayment}
                disabled={!isFormValid || loading || processingPayment || paymentInitiated || pincodeLoading}
                className="mt-6 w-full h-14 rounded-xl text-base font-medium group transition-all"
              >
                {processingPayment || paymentInitiated ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {paymentInitiated ? "Redirecting..." : "Processing..."}
                  </span>
                ) : loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Please wait...
                  </span>
                ) : pincodeLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating pincode...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 w-full">
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
              
              <div className="mt-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-5 h-5 opacity-50" />
                <p className="text-[11px] font-medium tracking-wide text-center max-w-[200px] opacity-70">
                  {paymentInitiated ? "Redirecting to secure gateway..." : "You'll be redirected to our secure payment gateway"}
                </p>
              </div>

            </motion.div>
          </div>

        </div>

        <div className="mt-12 sm:mt-24">
          <CartBenefits />
        </div>
      </div>
    </div>
  );`;
  
  content = content.substring(0, returnIndex) + newReturn + '\n}\n';
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated checkout UI');
