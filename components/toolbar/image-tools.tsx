"use client"

import AIRecolor from "@/components/toolbar/recolor"
import GenerativeFill from "@/components/toolbar/generative-fill"
import GenRemove from "@/components/toolbar/gen-remove"
import { useLayerStore } from "@/lib/layer-store"

export default function ImageTools() {
  const activeLayer = useLayerStore((state) => state.activeLayer)
  if (activeLayer.resourceType === "image")
    return (
      <>
        <AIRecolor />
        <GenerativeFill />
        <GenRemove />
      </>
    )
}
