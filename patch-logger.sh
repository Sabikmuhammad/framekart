#!/bin/bash
# We will inject console.logs to debug.

# PremiumVisitorPopup
sed -i '' -e 's/export default function PremiumVisitorPopup({/export default function PremiumVisitorPopup(props: any) { console.log("[PREMIUM POPUP RENDER]", typeof window !== "undefined" ? window.location.pathname : "server"); console.log("[PREMIUM POPUP PROPS]", JSON.stringify({isOpen: props.isOpen})); const {isOpen, onClose, onSuccess, title="Unlock Your Perfect Frame", subtitle="Enter your details...", eyebrow="Let'\''s stay connected", sourceOverride, triggerOverride} = props;/g' components/visitor/PremiumVisitorPopup.tsx

# Custom Frame Page - file selection
sed -i '' -e 's/const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {/const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => { console.log("[VisitorDebug] FILE SELECTED");/g' app/custom-frame/page.tsx

# Custom Frame Page - popup open
sed -i '' -e 's/setShowVisitorPopup(true);/console.log("[VisitorDebug] setShowVisitorPopup(true) called"); setShowVisitorPopup(true);/g' app/custom-frame/page.tsx

# VisitorTracker
sed -i '' -e 's/setShowPopup(true);/console.log("[VisitorDebug] setShowPopup(true) called"); setShowPopup(true);/g' components/visitor/VisitorTracker.tsx

