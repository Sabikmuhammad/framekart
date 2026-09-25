"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react";

interface TestWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestWhatsAppModal({ open, onOpenChange }: TestWhatsAppModalProps) {
  const [name, setName] = useState("Test User");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; code?: string } | null>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!phone) {
      toast({
        title: "Validation Error",
        description: "Please enter a WhatsApp number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (data.success) {
        setResult({
          success: true,
          message: data.messageId,
        });
        toast({
          title: "Test Message Sent",
          description: "Meta API accepted the template.",
        });
      } else {
        setResult({
          success: false,
          code: data.errorCode,
          message: data.errorMessage || data.error || "Unknown error",
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Optional: reset state on close
    setTimeout(() => {
      setResult(null);
      setName("Test User");
      setPhone("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Test WhatsApp Welcome Message</DialogTitle>
          <DialogDescription>
            Send a test message using the current FrameKart WhatsApp template.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Test User"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">WhatsApp Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 94806 32085"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2 items-start text-xs text-slate-500 mt-2">
            <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-slate-700">Configuration</span>
              <span>Template: framekart_welcome</span>
              <span>Language: English</span>
              <span>Header: Image</span>
              <span>Button: Static URL</span>
            </div>
          </div>

          {result && (
            <div className={`mt-2 p-3 rounded-lg border flex gap-3 text-sm items-start ${result.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
              {result.success ? <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" /> : <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />}
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{result.success ? "WhatsApp message sent successfully" : "WhatsApp message failed"}</span>
                {result.success ? (
                  <>
                    <span className="text-xs opacity-90 mt-1">Recipient: {phone}</span>
                    <span className="text-xs opacity-90">Template: framekart_welcome</span>
                    <span className="text-xs opacity-90 font-mono break-all mt-1">Message ID: {result.message}</span>
                  </>
                ) : (
                  <>
                    {result.code && <span className="text-xs font-semibold mt-1">Error Code: {result.code}</span>}
                    <span className="text-xs opacity-90 break-all">{result.message}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading || !phone}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Sending..." : "Send Test Message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
