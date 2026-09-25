"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface WhatsAppDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: any | null;
}

export function WhatsAppDetailDrawer({ open, onOpenChange, message }: WhatsAppDetailDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!message) return null;

  const handleCopy = () => {
    if (message.whatsappWelcomeMessageId) {
      navigator.clipboard.writeText(message.whatsappWelcomeMessageId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusDetails = () => {
    const s = message.whatsappDeliveryStatus || (message.whatsappWelcomeSent ? "SENT" : (message.whatsappWelcomeError ? "FAILED" : "PENDING"));
    if (s === "DELIVERED") return { label: "✓✓ Delivered", color: "bg-blue-100 text-blue-800 border-blue-200" };
    if (s === "READ") return { label: "✓✓ Read", color: "bg-blue-500 text-white border-blue-600" };
    if (s === "SENT") return { label: "✓ Sent", color: "bg-green-100 text-green-800 border-green-200" };
    if (s === "FAILED") return { label: "FAILED", color: "bg-red-100 text-red-800 border-red-200" };
    return { label: "PENDING", color: "bg-amber-100 text-amber-800 border-amber-200" };
  };

  const status = getStatusDetails();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">WhatsApp Welcome Message</SheetTitle>
          <SheetDescription>Detailed activity and status</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Customer</span>
              <span className="font-medium text-base">{message.name || "Customer"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</span>
              <span className="font-medium text-base">{message.phone}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</span>
              <div>
                <Badge className={status.color} variant="secondary">{status.label}</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Template</span>
              <span className="font-medium text-sm">framekart_welcome</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sent</span>
              <span className="font-medium text-sm">
                {message.whatsappWelcomeSentAt
                  ? new Date(message.whatsappWelcomeSentAt).toLocaleString("en-IN")
                  : new Date(message.createdAt).toLocaleString("en-IN")}
              </span>
            </div>

            {message.whatsappWelcomeMessageId && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Meta Message ID</span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[250px]">
                    {message.whatsappWelcomeMessageId}
                  </code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                    {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            )}

            {message.whatsappWelcomeError && (
              <div className="flex flex-col gap-1 bg-red-50/50 p-4 rounded-lg border border-red-100 mt-4">
                <span className="text-xs text-red-800 font-bold uppercase tracking-wider">Error Details</span>
                <span className="font-mono text-xs text-red-600 mt-1 whitespace-pre-wrap">
                  {message.whatsappWelcomeError}
                </span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 block">Message Preview</span>
            <div className="bg-[#e5ddd5] rounded-xl p-4 max-w-[90%] shadow-sm">
              <div className="bg-white rounded-lg p-2 shadow-sm relative">
                <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2 bg-muted flex items-center justify-center text-muted-foreground text-xs">
                  <span className="absolute z-10 flex flex-col items-center gap-1">
                    <ImageIcon className="h-6 w-6" />
                    <span>FrameKart Branding</span>
                  </span>
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-wrap">
                  Hi {message.name || "Customer"}, welcome to FrameKart.
                  {"\n\n"}
                  Turn your moments into timeless art.
                </p>
                <div className="text-[10px] text-slate-400 text-right mt-1">
                  {message.whatsappWelcomeSentAt ? new Date(message.whatsappWelcomeSentAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) : "10:32 PM"}
                </div>
              </div>
              <div className="mt-2 bg-white rounded-lg py-2 flex items-center justify-center text-[#00a884] font-medium text-sm shadow-sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit FrameKart
              </div>
            </div>
          </div>

          {message.aiConversation && message.aiConversation.messages && message.aiConversation.messages.length > 0 && (
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AI Conversation History</span>
                {message.aiConversation.conversationState === "HUMAN_HANDOFF" && (
                  <Badge variant="destructive" className="text-[10px]">Human Handoff</Badge>
                )}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                {message.aiConversation.messages.map((msg: any, i: number) => {
                  const isUser = msg.role === "user";
                  const isTool = msg.role === "tool";
                  if (isTool) return null; // hide raw tool data from general chat view for cleaner UI
                  return (
                    <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${
                        isUser 
                          ? "bg-[#d9fdd3] text-slate-800 rounded-tr-none shadow-sm" 
                          : "bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-100"
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span className="text-[9px] opacity-60 block mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
