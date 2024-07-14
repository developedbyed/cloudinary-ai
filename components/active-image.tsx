"use client"

import { useImageStore } from "@/lib/store"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useLayerStore } from "@/lib/layer-store"

export default function ActiveImage() {
  const generating = useImageStore((state) => state.generating)

  const activeLayer = useLayerStore((state) => state.activeLayer)
  console.log(activeLayer.url)
  if (activeLayer.url)
    return (
      <div className="w-[1280px] relative max-h-[960px] bg-secondary">
        <Image
          alt="active-image"
          src={activeLayer.url}
          fill={true}
          className={cn(
            "w-full rounded-lg object-contain",
            generating ? "animate-pulse" : ""
          )}
        />
      </div>
    )
}
