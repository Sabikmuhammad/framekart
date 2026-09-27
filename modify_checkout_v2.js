const fs = require('fs');
const path = './app/checkout/page.tsx';

let content = fs.readFileSync(path, 'utf8');

// Find the return statement
const returnStart = content.indexOf('  return (');
const returnEnd = content.lastIndexOf('  );') + 4;

if (returnStart === -1 || returnEnd === -1) {
  console.error("Could not find return statement");
  process.exit(1);
}

const newReturn = `  return (
    <div className="min-h-screen pb-[calc(140px+env(safe-area-inset-bottom))] lg:pb-12 bg-[#FAFAFA] dark:bg-background overflow-x-hidden w-full selection:bg-primary/10">
      {/* Premium Header */}
      <div className="pt-8 sm:pt-12 px-4 sm:px-6 text-center">
        <motion.p 
          className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SECURE CHECKOUT
        </motion.p>
        <motion.h1 
          className="text-[28px] sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Complete your order
        </motion.h1>
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="flex items-center justify-center gap-3 text-[11px] sm:text-xs font-semibold tracking-[0.1em] uppercase mb-10 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-foreground">01 Delivery</span>
        <span className="w-6 h-px bg-border"></span>
        <span className={paymentInitiated ? "text-foreground" : ""}>02 Payment</span>
      </motion.div>

      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-12 relative items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-[14px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-6">DELIVERY DETAILS</h2>
              
              {/* Saved Addresses Section */}
              {savedAddresses.length > 0 && (
                <div className="mb-8 space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => handleAddressSelect(address._id)}
                      className={\`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 bg-white dark:bg-secondary/10 \${
                        selectedAddressId === address._id
                          ? 'border-[2px] border-primary shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)]'
                          : 'border border-border/50 hover:border-border shadow-sm'
                      }\`}
                    >
                      {selectedAddressId === address._id && (
                        <div className="absolute top-5 right-5">
                          <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      )}
                      
                      <div className="pr-12">
                        <p className="font-semibold text-[15px] mb-1">{address.fullName}</p>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">
                          {address.addressLine1}, {address.addressLine2}
                          {address.landmark && \`, \${address.landmark}\`}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-[14px] text-muted-foreground mt-2">
                          {address.phone}
                        </p>
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
                      className="w-full h-14 rounded-2xl border-dashed bg-transparent hover:bg-secondary/20 font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  )}
                </div>
              )}

              {/* New Address Form */}
              {showNewAddressForm && (
                <div className="space-y-10">
                  {savedAddresses.length > 0 && (
                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                      <h3 className="text-[15px] font-semibold">New Address</h3>
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

                  {/* Contact Section */}
                  <div className="space-y-6">
                    <h3 className="text-[13px] font-semibold tracking-wider text-muted-foreground uppercase pb-2 border-b border-border/50">Contact</h3>
                    
                    <div className="grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName" className="text-[13px] font-semibold text-foreground/90">First Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          autoComplete="name"
                          placeholder="Enter your first name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-[13px] font-semibold text-foreground/90">Mobile Number *</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground font-medium">+91</span>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            placeholder="10-digit mobile number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            maxLength={10}
                            required
                            className="h-[52px] pl-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[13px] font-semibold text-foreground/90">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          autoComplete="email"
                          disabled={!!user?.email}
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div className="space-y-6">
                    <h3 className="text-[13px] font-semibold tracking-wider text-muted-foreground uppercase pb-2 border-b border-border/50">Delivery Address</h3>
                    
                    <div className="grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="addressLine1" className="text-[13px] font-semibold text-foreground/90">House / Flat / Building *</Label>
                        <Input
                          id="addressLine1"
                          name="addressLine1"
                          autoComplete="address-line1"
                          placeholder="e.g. Flat 101, Om Sai Apartments"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          required
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="addressLine2" className="text-[13px] font-semibold text-foreground/90">Road / Street / Area / Colony *</Label>
                        <Input
                          id="addressLine2"
                          name="addressLine2"
                          autoComplete="address-line2"
                          placeholder="e.g. MG Road, Koramangala"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          required
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="landmark" className="text-[13px] font-semibold text-foreground/90">Landmark</Label>
                        <Input
                          id="landmark"
                          name="landmark"
                          placeholder="e.g. Near City Mall"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2 relative">
                          <Label htmlFor="pincode" className="text-[13px] font-semibold text-foreground/90">Pincode *</Label>
                          <div className="relative">
                            <Input
                              id="pincode"
                              name="pincode"
                              type="text"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              placeholder="6-digit pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              onBlur={handlePincodeBlur}
                              maxLength={6}
                              pattern="[0-9]{6}"
                              required
                              className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200 pr-10"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {pincodeLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                              {!pincodeLoading && pincodeValid && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="city" className="text-[13px] font-semibold text-foreground/90">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            autoComplete="address-level2"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleInputChange}
                            readOnly={pincodeValid}
                            className={\`h-[52px] rounded-[14px] border-[#E2E8F0] dark:border-border focus-visible:ring-0 transition-all duration-200 \${pincodeValid ? 'bg-[#F1F5F9] dark:bg-secondary/30 text-muted-foreground' : 'bg-white dark:bg-background text-[#0F172A] dark:text-foreground'}\`}
                            required
                          />
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
                          <Label htmlFor="state" className="text-[13px] font-semibold text-foreground/90">State *</Label>
                          <Select
                            value={formData.state}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                            disabled={pincodeValid}
                            required
                          >
                            <SelectTrigger id="state" className={\`h-[52px] rounded-[14px] border-[#E2E8F0] dark:border-border focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200 \${pincodeValid ? 'bg-[#F1F5F9] dark:bg-secondary/30 text-muted-foreground' : 'bg-white dark:bg-background text-[#0F172A] dark:text-foreground'}\`}>
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] rounded-xl">
                              {INDIAN_STATES.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  <div className="space-y-6">
                    <h3 className="text-[13px] font-semibold tracking-wider text-muted-foreground uppercase pb-2 border-b border-border/50">Delivery Notes</h3>
                    <Textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      placeholder="Optional message..."
                      className="min-h-[100px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200 resize-none p-4"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Save Address Checkbox */}
                  <div 
                    onClick={() => setSaveAddress(!saveAddress)}
                    className="flex items-center gap-3 cursor-pointer select-none py-2"
                  >
                    <div className={\`w-5 h-5 rounded-[6px] flex items-center justify-center transition-colors \${
                      saveAddress ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30'
                    }\`}>
                      {saveAddress && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[14px] font-medium">Save this address for future orders</span>
                  </div>

                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              className="lg:sticky lg:top-8 bg-white dark:bg-secondary/10 rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-border/50 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-[14px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-6">YOUR ORDER</h2>
              
              <div className="space-y-5 mb-6">
                {items.map((item, i) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    {item.imageUrl && (
                      <div className="relative w-[60px] h-[60px] rounded-xl overflow-hidden bg-secondary/30 shrink-0 border border-border/50">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] line-clamp-2">{item.title}</p>
                      <p className="text-[13px] text-muted-foreground mt-0.5">Qty {item.quantity}</p>
                    </div>
                    <div className="text-[15px] font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-5 border-t border-border/50">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                  <div className="flex justify-between items-center text-[14px] text-primary">
                    <span className="font-medium">Offer</span>
                    <span className="font-medium">− {formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold tracking-wide uppercase text-primary">FREE</span>
                </div>
              </div>
              
              <div className="pt-5 mt-5 border-t border-border/50">
                <div className="flex justify-between items-center mb-1 w-full gap-2">
                  <span className="text-[15px] font-semibold tracking-wide">TOTAL</span>
                  <motion.span 
                    key={total}
                    className="text-[24px] sm:text-[28px] font-semibold tracking-tight"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {formatPrice(total)}
                  </motion.span>
                </div>
                {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                  <p className="text-[13px] font-medium text-right text-primary">
                    You save {formatPrice(discount)}
                  </p>
                )}
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:block mt-8">
                <Button
                  onClick={handlePayment}
                  disabled={!isFormValid || loading || processingPayment || paymentInitiated || pincodeLoading}
                  className="w-full h-[52px] rounded-[14px] text-[15px] font-semibold group transition-all tracking-wide"
                >
                  {processingPayment || paymentInitiated ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {paymentInitiated ? "Redirecting..." : "Processing..."}
                    </span>
                  ) : loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Please wait...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 w-full">
                      PROCEED TO PAYMENT
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 opacity-70" />
                  <p className="text-[12px] font-medium">
                    🔒 Secure checkout
                  </p>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Payment Bar */}
      <div className="lg:hidden fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 p-4 bg-white/90 dark:bg-background/90 backdrop-blur-xl border-t border-[#E2E8F0] dark:border-border/50 z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-4 max-w-[1100px] mx-auto">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Total</span>
            <span className="text-[20px] font-semibold leading-none mt-0.5">{formatPrice(total)}</span>
          </div>
          <Button
            onClick={handlePayment}
            disabled={!isFormValid || loading || processingPayment || paymentInitiated || pincodeLoading}
            className="flex-1 h-[52px] rounded-[14px] text-[14px] font-semibold tracking-wide"
          >
            {processingPayment || paymentInitiated || loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                PROCEED <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );`;

const finalContent = content.substring(0, returnStart) + newReturn + '\n}\n';
fs.writeFileSync(path, finalContent, 'utf8');
console.log('Successfully updated checkout UI');
