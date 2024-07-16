import { useImageStore } from "@/lib/store"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useLayerStore } from "@/lib/layer-store"

export default function ActiveImage() {
  const generating = useImageStore((state) => state.generating)
  const activeLayer = useLayerStore((state) => state.activeLayer)

  if (activeLayer.url)
    return (
      <div className="w-full relative h-[650px] bg-secondary flex flex-col items-center justify-center">
        {activeLayer.resourceType === "image" && (
          <Image
            alt={activeLayer.name!}
            src={activeLayer.url}
            fill={true}
            className={cn(
              "rounded-lg object-contain",
              generating ? "animate-pulse" : ""
            )}
          />
        )}
        {activeLayer.resourceType === "video" && (
          <video
            width={activeLayer.width}
            height={activeLayer.height}
            controls
            className="rounded-lg object-contain max-w-full max-h-full"
            src={activeLayer.transcriptionURL || activeLayer.url}
          />
        )}
      </div>
    )

  return null
}
