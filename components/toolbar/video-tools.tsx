"use client"
import VideoTranscription from "@/components/toolbar/transcribe"
import { useLayerStore } from "@/lib/layer-store"
import SmartCrop from "./smart-crop"

export default function VideoTools() {
  const activeLayer = useLayerStore((state) => state.activeLayer)
  if (activeLayer.resourceType === "video")
    return (
      <>
        <VideoTranscription />
        <SmartCrop />
      </>
    )
}
