import React, { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLayerStore } from "@/lib/layer-store"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card"
import { Button } from "./ui/button"
import { Ellipsis, GitCompare, Images, Layers2, Trash } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useImageStore } from "@/lib/store"
import LayerImage from "./layers/layer-image"
import { cn } from "@/lib/utils"

export default function Layers() {
  const layers = useLayerStore((state) => state.layers)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
  const addLayer = useLayerStore((state) => state.addLayer)
  const removeLayer = useLayerStore((state) => state.removeLayer)
  const generating = useImageStore((state) => state.generating)
  const layerComparisonMode = useLayerStore(
    (state) => state.layerComparisonMode
  )
  const setLayerComparisonMode = useLayerStore(
    (state) => state.setLayerComparisonMode
  )
  const comparedLayers = useLayerStore((state) => state.comparedLayers)
  const toggleComparedLayer = useLayerStore(
    (state) => state.toggleComparedLayer
  )
  const setComparedLayers = useLayerStore((state) => state.setComparedLayers)

  const MCard = useMemo(() => motion(Card), [])
  const MButton = useMemo(() => motion(Button), [])

  const getLayerName = (id: string) => {
    const layer = layers.find((l) => l.id === id)
    return layer
      ? layer.name || `Layer ${layers.indexOf(layer) + 1}`
      : "Nothing here"
  }

  return (
    <MCard
      layout
      className="basis-[320px] shrink-0  scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl"
    >
      <CardHeader className="sticky top-0 z-50 px-4 pt-12  min-h-28">
        {layerComparisonMode ? (
          <div>
            <CardTitle className="text-sm ">Compare</CardTitle>
            <CardDescription>
              {getLayerName(comparedLayers[0] || "")}
              {comparedLayers.length > 0 && " vs "}
              {comparedLayers.length > 1
                ? getLayerName(comparedLayers[1])
                : "Nothing here"}
            </CardDescription>
          </div>
        ) : (
          <div className="flex flex-col gap-1 ">
            <CardTitle className="text-sm">
              {activeLayer.name || "Layers"}
            </CardTitle>
            {activeLayer.width && activeLayer.height ? (
              <CardDescription className="text-xs">
                {activeLayer.width}X{activeLayer.height}
              </CardDescription>
            ) : null}
          </div>
        )}
      </CardHeader>
      <motion.div className="flex-1 flex flex-col ">
        <AnimatePresence>
          {layers.map((layer, index) => (
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              layout
              className={cn(
                "cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
                {
                  "border-primary": layerComparisonMode
                    ? comparedLayers.includes(layer.id)
                    : activeLayer.id === layer.id,
                  "animate-pulse": generating,
                }
              )}
              key={layer.id}
              onClick={() => {
                if (generating) return
                if (layerComparisonMode) {
                  toggleComparedLayer(layer.id)
                } else {
                  setActiveLayer(layer.id)
                }
              }}
            >
              <div className="relative p-4 flex items-center">
                <div className="flex gap-2 items-center h-8 w-full justify-between">
                  {!layer.url ? (
                    <p className="text-xs font-medium justify-self-end ">
                      New layer
                    </p>
                  ) : null}
                  <LayerImage layer={layer} />
                  {layers.length !== 1 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <Ellipsis size={18} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="text-xs">
                        <h3 className="text-lg font-medium text-center mb-2">
                          Layer {layer.id}
                        </h3>
                        <div className="py-4 space-y-0.5">
                          <p>
                            <span className="font-bold">Filename:</span>{" "}
                            {layer.name}
                          </p>
                          <p>
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
                              index === 0 ? layers[1].id : layers[0].id
                            )
                            removeLayer(layer.id)
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <CardContent className="sticky bottom-0 bg-card flex gap-2  shrink-0">
        <MButton
          layout
          onClick={() => {
            addLayer({
              id: crypto.randomUUID(),
              url: "",
              height: 0,
              width: 0,
              publicId: "",
              name: "",
              format: "",
            })
          }}
          variant="outline"
          className="w-full flex gap-2"
        >
          <span className="text-xs">Create Layer</span>
          <Layers2 className="text-secondary-foreground" size={18} />
        </MButton>
        <MButton
          layout
          onClick={() => {
            if (layerComparisonMode) {
              setLayerComparisonMode(!layerComparisonMode)
            } else {
              setComparedLayers([activeLayer.id])
            }
          }}
          variant={layerComparisonMode ? "default" : "outline"}
          className="w-full flex gap-2"
        >
          <motion.span className="text-xs font-bold">
            {layerComparisonMode ? "Select" : "Compare"}
          </motion.span>
          {!layerComparisonMode && (
            <Images className="text-secondary-foreground" size={18} />
          )}
        </MButton>
      </CardContent>
    </MCard>
  )
}
