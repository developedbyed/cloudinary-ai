"use client"

import { useImageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { bgRemoval } from "@/server/bg-remove"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Image, Paintbrush } from "lucide-react"
import { useLayerStore } from "@/lib/layer-store"
import { toast } from "sonner"

export default function BgRemove() {
  const tags = useImageStore((state) => state.tags)
  const setActiveTag = useImageStore((state) => state.setActiveTag)
  const activeTag = useImageStore((state) => state.activeTag)
  const setActiveColor = useImageStore((state) => state.setActiveColor)
  const activeColor = useImageStore((state) => state.activeColor)
  const setGenerating = useImageStore((state) => state.setGenerating)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const addLayer = useLayerStore((state) => state.addLayer)
  const layers = useLayerStore((state) => state.layers)
  const generating = useImageStore((state) => state.generating)
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            BG Removal
            <Image size={18} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Background Removal</h4>
            <p className="text-sm max-w-xs text-muted-foreground">
              Remove the background of an image with one simple click.
            </p>
          </div>
        </div>

        <Button
          disabled={
            !activeLayer?.url || !activeTag || !activeColor || generating
          }
          className="w-full mt-4"
          onClick={async () => {
            setGenerating(true)
            const res = await bgRemoval({
              activeImage: activeLayer.url!,
              format: activeLayer.format!,
            })
            if (res?.data?.success) {
              const newLayerId = crypto.randomUUID()
              addLayer({
                id: newLayerId,
                name: "bg-removed" + activeLayer.name,
                format: "png",
                height: activeLayer.height,
                width: activeLayer.width,
                url: res.data.success,
                publicId: activeLayer.publicId,
                resourceType: "image",
              })
              setGenerating(false)
              setActiveLayer(newLayerId)
            }
            if (res?.serverError) {
              toast.error(res.serverError)
              setGenerating(false)
            }
          }}
        >
          {generating ? "Removing..." : "Remove Background"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
