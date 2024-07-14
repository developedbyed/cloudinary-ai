"use client"

import { useImageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { recolorImage } from "@/server/recolor"
import { useAction } from "next-safe-action/hooks"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo, useState } from "react"
import { genFill } from "@/server/gen-fill"
import { Crop } from "lucide-react"
import { useLayerStore } from "@/lib/layer-store"

export default function GenerativeFill() {
  const setGenerating = useImageStore((state) => state.setGenerating)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const addLayer = useLayerStore((state) => state.addLayer)
  const layers = useLayerStore((state) => state.layers)
  const MotionPopover = useMemo(() => motion(Popover), [])
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

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
        <PopoverContent className="w-80">
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
                  className=" h-8 "
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
              <Label htmlFor="maxWidth">Modify Height</Label>
              <div className="flex gap-2">
                <Input
                  name="height"
                  type="range"
                  min={-activeLayer.height + 1}
                  max={activeLayer.height}
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className=" h-8 "
                />
                <Input
                  name="height"
                  type="number"
                  min={-activeLayer.width + 1}
                  max={activeLayer.width}
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-4"
            disabled={!activeLayer.url || !width || !height}
            onClick={async () => {
              setGenerating(true)
              const res = await genFill({
                width: (width + activeLayer.width!).toString(),
                height: (height + activeLayer.height!).toString(),
                aspect: "1:1",
                url: activeLayer.url,
              })

              if (res?.data?.success) {
                console.log(res.data.success)
                setGenerating(false)
                addLayer({
                  count: layers.length + 1,
                  name: "generative-fill",
                  format: activeLayer.format,
                  height,
                  width,
                })
              }
              if (res?.data?.error) {
                console.log(res.data.error)
                setGenerating(false)
              }
            }}
          >
            Generative Fill 🎨
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
