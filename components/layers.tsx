"use client"

import { useLayerStore } from "@/lib/layer-store"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Ellipsis, Layers2, Trash } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useImageStore } from "@/lib/store"

export default function Layers() {
  const layers = useLayerStore((state) => state.layers)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
  const addLayer = useLayerStore((state) => state.addLayer)
  const removeLayer = useLayerStore((state) => state.removeLayer)
  const generating = useImageStore((state) => state.generating)

  const MCard = useMemo(() => motion(Card), [])
  const MButton = useMemo(() => motion(Button), [])
  const MPopoverContent = useMemo(() => motion(PopoverContent), [])
  console.log("layers", layers)

  return (
    <motion.div
      layout
      className="w-[480px] h-[500px] overflow-y-auto overflow-x-hidden relative "
    >
      <motion.div className="flex-1 flex flex-col  gap-2">
        <AnimatePresence>
          {layers.map((layer, index) => (
            <MCard
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              layout
              className={cn(
                " cursor-pointer  ease-in-out hover:bg-secondary hover:border-primary",
                activeLayer.count === layer.count && " border-primary",
                generating && "animate-pulse"
              )}
              key={layer.count}
              onClick={(e) => {
                if (!generating) {
                  setActiveLayer(layer.count)
                }
              }}
            >
              <CardContent className="relative p-4 flex  items-center">
                <div className="flex gap-2 items-center h-12  w-full justify-between">
                  <div
                    className={`flex gap-1 flex-col items-center justify-center `}
                  >
                    <p className="text-xs font-medium">Layer</p>
                    <p className="text-xs font-bold">{layer.count}</p>
                  </div>
                  {layer.url && (
                    <>
                      <div className="w-12 h-12 flex items-center justify-center ">
                        <Image
                          className="w-full object-contain rounded-sm"
                          alt={"layer"}
                          src={
                            layer.format === "mp4"
                              ? layer.poster || layer.url
                              : layer.url
                          }
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className=" relative">
                        <p className="text-xs">{`${layer.name?.slice(0, 15)}.${
                          layer.format
                        }`}</p>
                      </div>
                    </>
                  )}

                  {layers.length !== 1 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <Ellipsis size={18} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="text-xs">
                        <h3 className="text-lg font-medium text-center mb-2">
                          Layer {layer.count}
                        </h3>
                        <div className="py-4 space-y-0.5">
                          <p>
                            <span className="font-bold">Filename:</span>{" "}
                            {layer.name}
                          </p>
                          <p>
                            {" "}
                            <span className="font-bold">Format:</span>{" "}
                            {layer.format}
                          </p>
                          <p>
                            <span className="font-bold"> Size:</span>{" "}
                            {layer.width}X{layer.height}
                          </p>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveLayer(
                              index === 0 ? layers[1].count : layers[0].count
                            )
                            removeLayer(layer.count)
                          }}
                          variant={"destructive"}
                          className="flex items-center gap-2 w-full"
                        >
                          <span> Delete Layer</span>
                          <Trash size={14} />
                        </Button>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </CardContent>
            </MCard>
          ))}
        </AnimatePresence>
        <MButton
          layout
          onClick={(e) => {
            addLayer({
              count: layers[layers.length - 1].count + 1,
              url: "",
              height: 0,
              width: 0,
              publicId: "",
              name: "",
              format: "",
            })
          }}
          variant={"outline"}
          className="sticky bottom-0 flex gap-2  w-full py-2"
        >
          <span className="text-xs">Create Layer</span>{" "}
          <Layers2 className="text-secondary-foreground" size={18} />
        </MButton>
      </motion.div>
    </motion.div>
  )
}
