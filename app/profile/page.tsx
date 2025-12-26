"use client";

import { useUser, UserProfile, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, FileText, Truck, RotateCcw, Shield, Lock, ChevronRight, User, Settings, LogOut, MapPin, Plus, Trash2, Edit, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry",
];

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetch("/api/orders/user")
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders API response:", data);
        if (data.success) {
          setOrders(data.data);
          console.log("Orders loaded:", data.data.length);
        } else {
          console.error("Failed to fetch orders:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch saved addresses
  useEffect(() => {
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAddresses(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
      })
      .finally(() => setAddressLoading(false));
  }, []);

  // Handle address form submission
  const handleAddressSubmit = async () => {
    try {
      const url = editingAddressId 
        ? `/api/addresses/${editingAddressId}` 
        : "/api/addresses";
      const method = editingAddressId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: editingAddressId ? "Address updated" : "Address added",
          description: "Your address has been saved successfully",
        });

        // Refresh addresses
        const addressesRes = await fetch("/api/addresses");
        const addressesData = await addressesRes.json();
        if (addressesData.success) {
          setAddresses(addressesData.data);
        }

        // Reset form
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressForm({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          landmark: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save address",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAddresses(addresses.filter((addr) => addr._id !== addressId));
        toast({
          title: "Address deleted",
          description: "Your address has been removed",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  // Handle edit address
  const handleEditAddress = (address: any) => {
    setEditingAddressId(address._id);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  const policyLinks = [
    { href: "/shipping-policy", label: "Shipping Policy", icon: Truck, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { href: "/return-policy", label: "Return Policy", icon: RotateCcw, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
    { href: "/terms", label: "Terms & Conditions", icon: FileText, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { href: "/privacy", label: "Privacy Policy", icon: Lock, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your account settings and view your order history
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column: Profile & Settings */}
          <div className="space-y-4 sm:space-y-6">
            {/* User Info Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName || "Profile"} 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
                
                {/* Logout Button */}
                <Button
                  onClick={() => signOut(() => router.push("/"))}
                  variant="outline"
                  className="w-full justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <div className="w-full max-h-[400px] sm:max-h-[500px] overflow-y-auto rounded-lg shadow-inner bg-gray-50 dark:bg-gray-900 p-1 sm:p-2">
                  <UserProfile 
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 rounded-lg bg-white dark:bg-gray-800",
                        navbar: "hidden",
                        pageScrollBox: "p-2 sm:p-4",
                        profileSectionTitle: "text-sm sm:text-base font-semibold",
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm sm:text-base",
                        formFieldLabel: "text-xs sm:text-sm",
                        formFieldInput: "text-sm sm:text-base",
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Policies Section */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Policies & Legal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {policyLinks.map((policy) => (
                    <Link
                      key={policy.href}
                      href={policy.href}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${policy.bg} flex items-center justify-center ${policy.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <policy.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {policy.label}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Saved Addresses Section */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Saved Addresses
                  </CardTitle>
                  {!showAddressForm && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowAddressForm(true);
                        setEditingAddressId(null);
                        setAddressForm({
                          fullName: user?.fullName || "",
                          phone: "",
                          addressLine1: "",
                          addressLine2: "",
                          landmark: "",
                          city: "",
                          state: "",
                          pincode: "",
                          isDefault: addresses.length === 0,
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {addressLoading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                    ))}
                  </div>
                ) : showAddressForm ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Full Name*</Label>
                        <Input
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          placeholder="Your name"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Phone*</Label>
                        <Input
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="10 digits"
                          maxLength={10}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">House/Building*</Label>
                      <Input
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                        placeholder="Flat, Building name"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Street/Area*</Label>
                      <Input
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                        placeholder="Road, Colony, Area"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Landmark</Label>
                      <Input
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        placeholder="Optional"
                        className="text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Pincode*</Label>
                        <Input
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          placeholder="6 digits"
                          maxLength={6}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">City*</Label>
                        <Input
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="City"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">State*</Label>
                        <Select
                          value={addressForm.state}
                          onValueChange={(value) => setAddressForm({ ...addressForm, state: value })}
                        >
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {INDIAN_STATES.map((state) => (
                              <SelectItem key={state} value={state} className="text-sm">
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="h-4 w-4 rounded"
                      />
                      <Label htmlFor="isDefault" className="text-xs cursor-pointer">
                        Set as default address
                      </Label>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleAddressSubmit} className="flex-1" size="sm">
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                        }}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all relative group"
                      >
                        <div className="pr-16">
                          <p className="font-semibold text-sm">{address.fullName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {address.addressLine1}, {address.addressLine2}
                            {address.landmark && `, ${address.landmark}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            📞 {address.phone}
                          </p>
                          {address.isDefault && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3 flex gap-1">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-muted-foreground mb-3">No saved addresses</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowAddressForm(true);
                        setAddressForm({
                          fullName: user?.fullName || "",
                          phone: "",
                          addressLine1: "",
                          addressLine2: "",
                          landmark: "",
                          city: "",
                          state: "",
                          pincode: "",
                          isDefault: true,
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order History (2 columns on desktop) */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-24 sm:h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
                      />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order: any) => (
                      <Link
                        key={order._id}
                        href={`/orders/${order._id}`}
                        className="block group"
                      >
                        <div className="p-3 sm:p-4 lg:p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800">
                          <div className="flex items-center justify-between gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                  #{order._id.slice(-8).toUpperCase()}
                                </p>
                                <span
                                  className={`rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold ${
                                    (order.status === "Delivered" || order.status === "Shipped")
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : (order.status === "Processing" || order.status === "Printed")
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                      : order.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                                  }`}
                                >
                                  {order.status || "Pending"}
                                </span>
                                {order.paymentStatus === "completed" && (
                                  <span className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Paid
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                <span className="text-[10px] sm:text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                              <p className="text-base sm:text-lg font-bold text-primary">
                                {formatPrice(order.totalAmount)}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-all flex-shrink-0" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 sm:py-16 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Package className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                    </div>
                    <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">No orders yet</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 px-4">
                      Start shopping to see your orders here
                    </p>
                    <Link href="/frames">
                      <button className="px-5 py-2 sm:px-6 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base">
                        Browse Frames
                      </button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
