"use client"

import { useImageStore } from "@/lib/store"
import { Button } from "./ui/button"
import { recolorImage } from "@/server/recolor"
import { useAction } from "next-safe-action/hooks"
import { Badge } from "./ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo } from "react"
import { Paintbrush } from "lucide-react"

export default function AIRecolor() {
  const tags = useImageStore((state) => state.tags)
  const setActiveTag = useImageStore((state) => state.setActiveTag)
  const activeTag = useImageStore((state) => state.activeTag)
  const activeImage = useImageStore((state) => state.activeImage)
  const setActiveColor = useImageStore((state) => state.setActiveColor)
  const setActiveImage = useImageStore((state) => state.setActiveImage)
  const activeColor = useImageStore((state) => state.activeColor)
  const setGenerating = useImageStore((state) => state.setGenerating)

  const MotionPopover = useMemo(() => motion(Popover), [])

  const { execute } = useAction(recolorImage, {
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
                <span className="flex items-center justify-center gap-2">
                  <Paintbrush size={18} />
                  AI Recolor
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    Generative Recolor
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Recolor any part of your image with generative recolor.
                  </p>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-xs">Suggested selections</h3>
                  <div className="flex gap-2">
                    {tags.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No tags available
                      </p>
                    )}
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={cn(
                          "px-2 py-1 rounded text-xs",
                          activeTag === tag && "bg-primary text-white"
                        )}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Selection</Label>
                    <Input
                      className="col-span-2 h-8"
                      value={activeTag}
                      name="tag"
                      onChange={(e) => {
                        setActiveTag(e.target.value)
                      }}
                    />
                  </div>
                  <h3 className="text-xs">Suggested colors</h3>
                  <div className="flex gap-2">
                    <div
                      className="w-4 h-4 bg-blue-500 rounded-sm cursor-pointer"
                      onClick={() => setActiveColor("blue")}
                    ></div>
                    <div
                      className="w-4 h-4 bg-red-500 rounded-sm cursor-pointer"
                      onClick={() => setActiveColor("red")}
                    ></div>
                    <div
                      className="w-4 h-4 bg-green-500 rounded-sm cursor-pointer"
                      onClick={() => setActiveColor("green")}
                    ></div>
                    <div
                      className="w-4 h-4 bg-yellow-500 rounded-sm cursor-pointer"
                      onClick={() => setActiveColor("yellow")}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">Color</Label>
                    <Input
                      name="color"
                      value={activeColor}
                      onChange={(e) => setActiveColor(e.target.value)}
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                disabled={!activeTag || !activeColor || !activeImage}
                onClick={() => {
                  execute({
                    color: `to-color_` + activeColor,
                    activeImage: activeImage,
                    tag: "prompt_" + activeTag,
                  })
                }}
              >
                Recolor 🎨
              </Button>
            </PopoverContent>
          </MotionPopover>
        )}
      </AnimatePresence>
    </div>
  )
}
