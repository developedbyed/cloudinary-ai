"use client"

import { useImageStore } from "@/lib/store"
import { Button } from "./ui/button"
import { recolorImage } from "@/server/recolor"
import { useAction } from "next-safe-action/hooks"
import { Badge } from "./ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo, useState } from "react"
import { genFill } from "@/server/gen-fill"
import { Crop } from "lucide-react"

export default function GenerativeFill() {
  const activeImage = useImageStore((state) => state.activeImage)
  const setGenerating = useImageStore((state) => state.setGenerating)
  const setActiveImage = useImageStore((state) => state.setActiveImage)
  const imageHeight = useImageStore((state) => state.imageHeight)
  const imageWidth = useImageStore((state) => state.imageWidth)
  const setXCrop = useImageStore((state) => state.setXCrop)
  const setYCrop = useImageStore((state) => state.setYCrop)
  const MotionPopover = useMemo(() => motion(Popover), [])
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const { execute } = useAction(genFill, {
    onSuccess: ({ data }) => {
      console.log("done processing")
      if (data) {
        console.log(data.success)
        setActiveImage(data?.success)
        setGenerating(false)
      }
    },
    onExecute: () => {
      setGenerating(true)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  return (
    <div className="">
      <AnimatePresence>
        {activeImage && (
          <MotionPopover
            animate={{ opacity: 0, scale: 1 }}
            initial={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <PopoverTrigger asChild>
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
                  <p className="text-sm text-muted-foreground">
                    Current size {imageWidth}x{imageHeight}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    New Size {width + imageWidth}x{height + imageHeight}
                  </p>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxWidth">Extend Width</Label>
                  <Input
                    name="width"
                    type="number"
                    value={width}
                    onChange={(e) => {
                      setWidth(parseInt(e.target.value))
                      setXCrop(parseInt(e.target.value))
                    }}
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxWidth">Extend Height</Label>
                  <Input
                    name="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="col-span-2 h-8"
                  />
                </div>
              </div>

              <Button
                className="w-full mt-4"
                disabled={!activeImage}
                onClick={() => {
                  execute({
                    activeImage: activeImage,
                    width: (width + imageWidth).toString(),
                    height: (height + imageHeight).toString(),
                    aspect: "1:1",
                  })
                }}
              >
                Generative Fill 🎨
              </Button>
            </PopoverContent>
          </MotionPopover>
        )}
      </AnimatePresence>
    </div>
  )
}
