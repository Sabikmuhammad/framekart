"use client";

import { motion } from "framer-motion";
import { Cake, Heart, Calendar, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type OccasionType = "custom" | "birthday" | "wedding";

export interface OccasionMetadata {
  // Birthday-specific
  name?: string;
  age?: string;
  date?: string;
  message?: string;
  // Wedding-specific
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  quote?: string;
}

interface OccasionFormProps {
  occasion: OccasionType;
  metadata: OccasionMetadata;
  onMetadataChange: (metadata: OccasionMetadata) => void;
}

export function OccasionForm({ occasion, metadata, onMetadataChange }: OccasionFormProps) {
  const updateField = (field: keyof OccasionMetadata, value: string) => {
    onMetadataChange({ ...metadata, [field]: value });
  };

  if (occasion === "custom") {
    return null; // No extra fields for custom frames
  }

  if (occasion === "birthday") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 p-6 rounded-xl border border-pink-200 dark:border-pink-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-500 rounded-lg">
            <Cake className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Birthday Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Personalize your birthday frame</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              Name <span className="text-pink-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Sarah"
              value={metadata.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              className="mt-1.5 border-pink-200 dark:border-pink-800 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">
              Age <span className="text-pink-500">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 25"
              value={metadata.age || ""}
              onChange={(e) => updateField("age", e.target.value)}
              className="mt-1.5 border-pink-200 dark:border-pink-800 focus:border-pink-500"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Birthday Date <span className="text-pink-500">*</span>
          </Label>
          <Input
            id="date"
            type="date"
            value={metadata.date || ""}
            onChange={(e) => updateField("date", e.target.value)}
            className="mt-1.5 border-pink-200 dark:border-pink-800 focus:border-pink-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Birthday Message
          </Label>
          <Textarea
            id="message"
            placeholder="e.g., Happy Birthday! Wishing you joy and laughter..."
            value={metadata.message || ""}
            onChange={(e) => updateField("message", e.target.value)}
            className="mt-1.5 border-pink-200 dark:border-pink-800 focus:border-pink-500 min-h-[100px]"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {(metadata.message || "").length}/200 characters
          </p>
        </div>
      </motion.div>
    );
  }

  if (occasion === "wedding") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/20 dark:to-amber-950/20 p-6 rounded-xl border border-rose-200 dark:border-rose-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rose-500 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wedding Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Celebrate your special day</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brideName" className="text-gray-700 dark:text-gray-300">
              Bride&apos;s Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="brideName"
              placeholder="e.g., Emily"
              value={metadata.brideName || ""}
              onChange={(e) => updateField("brideName", e.target.value)}
              className="mt-1.5 border-rose-200 dark:border-rose-800 focus:border-rose-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="groomName" className="text-gray-700 dark:text-gray-300">
              Groom&apos;s Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="groomName"
              placeholder="e.g., Michael"
              value={metadata.groomName || ""}
              onChange={(e) => updateField("groomName", e.target.value)}
              className="mt-1.5 border-rose-200 dark:border-rose-800 focus:border-rose-500"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="weddingDate" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Wedding Date <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="weddingDate"
            type="date"
            value={metadata.weddingDate || ""}
            onChange={(e) => updateField("weddingDate", e.target.value)}
            className="mt-1.5 border-rose-200 dark:border-rose-800 focus:border-rose-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="quote" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Wedding Quote or Message
          </Label>
          <Textarea
            id="quote"
            placeholder='e.g., "Two souls with but a single thought, two hearts that beat as one"'
            value={metadata.quote || ""}
            onChange={(e) => updateField("quote", e.target.value)}
            className="mt-1.5 border-rose-200 dark:border-rose-800 focus:border-rose-500 min-h-[100px]"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {(metadata.quote || "").length}/200 characters
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
}
