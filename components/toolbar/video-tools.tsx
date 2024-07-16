"use client"
import VideoTranscription from "@/components/toolbar/transcribe"
import { useLayerStore } from "@/lib/layer-store"

export default function VideoTools() {
  const activeLayer = useLayerStore((state) => state.activeLayer)
  if (activeLayer.resourceType === "video")
    return (
      <>
        <VideoTranscription />
      </>
    )
}
