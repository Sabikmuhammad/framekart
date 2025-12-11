/**
 * Frame Mockup Component
 * 
 * This component demonstrates how to create frame mockups using CSS.
 * You can use this pattern to create more advanced frame overlays.
 */

interface FrameMockupProps {
  imageUrl: string;
  frameStyle: "Black" | "White" | "Wooden";
  frameThickness?: number; // in pixels
}

export default function FrameMockup({ 
  imageUrl, 
  frameStyle, 
  frameThickness = 32 
}: FrameMockupProps) {
  const frameColors = {
    Black: "#1a1a1a",
    White: "#f5f5f5",
    Wooden: "#8B4513",
  };

  return (
    <div className="relative w-full h-full">
      {/* Outer Frame Border */}
      <div
        className="absolute inset-0 shadow-2xl transition-all duration-300"
        style={{
          backgroundColor: frameColors[frameStyle],
          padding: `${frameThickness}px`,
        }}
      >
        {/* Inner White Mat */}
        <div className="relative w-full h-full bg-white shadow-inner p-4">
          {/* Image Container */}
          <div className="relative w-full h-full overflow-hidden rounded-sm shadow-md">
            <img
              src={imageUrl}
              alt="Framed image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Frame Texture Overlay (optional) */}
        {frameStyle === "Wooden" && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * import FrameMockup from "@/components/FrameMockup";
 * 
 * <div className="w-96 h-96">
 *   <FrameMockup 
 *     imageUrl="https://your-image-url.com/image.jpg"
 *     frameStyle="Black"
 *     frameThickness={40}
 *   />
 * </div>
 */

/**
 * ADVANCED FRAME MOCKUP OPTIONS:
 * 
 * For more realistic frame effects, you can:
 * 
 * 1. Use actual frame PNG overlays from design tools
 * 2. Add 3D shadow effects with multiple box-shadows
 * 3. Use CSS gradients for depth
 * 4. Add glass reflection overlays
 * 
 * Example with PNG overlay:
 * 
 * <div className="relative w-full h-full">
 *   <img src={userImage} className="w-full h-full object-cover" />
 *   <img 
 *     src="/frames/black-frame-overlay.png" 
 *     className="absolute inset-0 w-full h-full pointer-events-none"
 *   />
 * </div>
 */
