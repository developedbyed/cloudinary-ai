import { useImageStore } from "@/lib/store"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Layer, useLayerStore } from "@/lib/layer-store"
import Lottie from "lottie-react"
import AiAnimation from "@/public/animations/ai-generating.json"
import { motion } from "framer-motion"
import ImageComparison from "./layers/image-comparison"

export default function ActiveImage() {
  const generating = useImageStore((state) => state.generating)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const layerComparisonMode = useLayerStore(
    (state) => state.layerComparisonMode
  )
  const comparedLayers = useLayerStore((state) => state.comparedLayers)
  const layers = useLayerStore((state) => state.layers)

  if (!activeLayer.url && comparedLayers.length === 0) return null

  const renderLayer = (layer: Layer) => (
    <div className="relative w-full h-full ">
      {generating && (
        <div className="absolute w-full h-full flex flex-col gap-4 items-center justify-center bg-black opacity-75 animate-pulse z-10">
          <p className="text-2xl font-medium">Applying fancy effects</p>
          <p>{layer.name}</p>
          <Lottie animationData={AiAnimation} />
        </div>
      )}
      {layer.resourceType === "image" && (
        <Image
          alt={layer.name || "Image"}
          src={layer.url || ""}
          fill={true}
          className={cn(
            "rounded-lg object-contain",
            generating ? "animate-pulse" : ""
          )}
        />
      )}
      {layer.resourceType === "video" && (
        <video
          width={layer.width}
          height={layer.height}
          controls
          className="rounded-lg object-contain max-w-full max-h-full"
          src={layer.transcriptionURL || layer.url}
        />
      )}
    </div>
  )

  if (layerComparisonMode && comparedLayers.length > 0) {
    const comparisonLayers = comparedLayers
      .map((id) => layers.find((l) => l.id === id))
      .filter(Boolean) as Layer[]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full relative h-[650px] bg-secondary flex items-center justify-center"
      >
        <ImageComparison layers={comparisonLayers} />
      </motion.div>
    )
  }

  return (
    <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
      {renderLayer(activeLayer)}
    </div>
  )
}
