import React, { useMemo, useState } from "react"
import { useImageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { genFill } from "@/server/gen-fill"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Crop } from "lucide-react"
import { useLayerStore } from "@/lib/layer-store"

const PREVIEW_SIZE = 200
const POPOVER_HEIGHT = 400

export default function GenerativeFill() {
  const setGenerating = useImageStore((state) => state.setGenerating)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const addLayer = useLayerStore((state) => state.addLayer)
  const layers = useLayerStore((state) => state.layers)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const generating = useImageStore((state) => state.generating)
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer)

  const previewStyle = useMemo(() => {
    if (!activeLayer.width || !activeLayer.height) return {}

    const newWidth = activeLayer.width + width
    const newHeight = activeLayer.height + height

    const scale = Math.min(PREVIEW_SIZE / newWidth, PREVIEW_SIZE / newHeight)

    return {
      width: `${newWidth * scale}px`,
      height: `${newHeight * scale}px`,
      backgroundImage: `url(${activeLayer.url})`,
      backgroundSize: `${activeLayer.width * scale}px ${
        activeLayer.height * scale
      }px`,

      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "relative" as const,
    }
  }, [activeLayer, width, height])

  const previewOverlayStyle = useMemo(() => {
    if (!activeLayer.width || !activeLayer.height) return {}

    const scale = Math.min(
      PREVIEW_SIZE / (activeLayer.width + width),
      PREVIEW_SIZE / (activeLayer.height + height)
    )

    const leftWidth = width > 0 ? `${(width / 2) * scale}px` : "0"
    const rightWidth = width > 0 ? `${(width / 2) * scale}px` : "0"
    const topHeight = height > 0 ? `${(height / 2) * scale}px` : "0"
    const bottomHeight = height > 0 ? `${(height / 2) * scale}px` : "0"

    return {
      position: "absolute" as const,
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      boxShadow: `inset ${leftWidth} ${topHeight} 0 rgb(255, 99, 71), 
                  inset -${rightWidth} ${topHeight} 0 rgb(255, 99, 71), 
                  inset ${leftWidth} -${bottomHeight} 0 rgb(255, 99, 71), 
                  inset -${rightWidth} -${bottomHeight} 0 rgba(0,0,0,0.5)`,
    }
  }, [activeLayer, width, height])

  const handleGenFill = async () => {
    setGenerating(true)
    const res = await genFill({
      width: (width + activeLayer.width!).toString(),
      height: (height + activeLayer.height!).toString(),
      aspect: "1:1",
      activeImage: activeLayer.url,
    })
    if (res?.data?.success) {
      console.log(res.data.success)
      setGenerating(false)
      addLayer({
        count: layers.length + 1,
        name: "generative-fill",
        format: activeLayer.format,
        height: height + activeLayer.height!,
        width: width + activeLayer.width!,
        url: res.data.success,
        publicId: activeLayer.publicId,
      })
      setActiveLayer(layers.length + 1)
    }
    if (res?.data?.error) {
      console.log(res.data.error)
      setGenerating(false)
    }
  }

  return (
    <div className="">
      <Popover>
        <PopoverTrigger disabled={!activeLayer?.url} asChild>
          <Button variant="outline">
            <span className="flex items-center gap-2 justify-center">
              <Crop size={18} />
              Generative Fill
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          style={{ height: `${POPOVER_HEIGHT}px`, overflowY: "auto" }}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Generative Fill</h4>
              {activeLayer.width && activeLayer.height ? (
                <>
                  <p>
                    Current Size: {activeLayer.width}X{activeLayer.height}
                  </p>
                  <p>
                    New Size: {activeLayer.width + width}X
                    {activeLayer.height + height}
                  </p>
                </>
              ) : null}
            </div>

            <div className="">
              <Label htmlFor="maxWidth">Modify Width</Label>
              <div className="flex gap-2">
                <Input
                  name="width"
                  type="range"
                  min={-activeLayer.width + 1}
                  max={activeLayer.width}
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="h-8"
                />
                <Input
                  name="width"
                  type="number"
                  value={width}
                  onChange={(e) => {
                    setWidth(parseInt(e.target.value))
                  }}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
            <div className="">
              <Label htmlFor="maxHeight">Modify Height</Label>
              <div className="flex gap-2">
                <Input
                  name="height"
                  type="range"
                  min={-activeLayer.height + 1}
                  max={activeLayer.height}
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="h-8"
                />
                <Input
                  name="height"
                  type="number"
                  min={-activeLayer.height + 1}
                  max={activeLayer.height}
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>
            {/* Preview */}
            <div
              className="preview-container"
              style={{
                width: `${PREVIEW_SIZE}px`,
                height: `${PREVIEW_SIZE}px`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                margin: "auto",
                backgroundColor: "black",
              }}
            >
              <div style={previewStyle}>
                <div style={previewOverlayStyle}></div>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-4"
            disabled={!activeLayer.url || (!width && !height) || generating}
            onClick={handleGenFill}
          >
            {generating ? "Generating" : "Generative Fill 🎨"}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
