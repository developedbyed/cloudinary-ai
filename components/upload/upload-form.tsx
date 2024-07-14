"use client"

import { uploadImage } from "@/server/upload-image"
import { useImageStore } from "@/lib/store"
import { useDropzone } from "react-dropzone"
import Lottie from "lottie-react"
import cloudAnimation from "@/public/animations/cloud-animation.json"
import { Card, CardContent } from "../ui/card"
import { cn } from "@/lib/utils"
import { useLayerStore } from "@/lib/layer-store"

export default function UploadForm() {
  const setTags = useImageStore((state) => state.setTags)
  const setGenerating = useImageStore((state) => state.setGenerating)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const updateLayer = useLayerStore((state) => state.updateLayer)
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
  console.log(activeLayer.count + "active")
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const formData = new FormData()
      formData.append("image", acceptedFiles[0])
      //Generate Object url
      const objectUrl = URL.createObjectURL(acceptedFiles[0])
      setGenerating(true)
      activeLayer.url = objectUrl
      const res = await uploadImage({ image: formData })

      if (res?.data?.success) {
        updateLayer({
          count: activeLayer.count,
          url: res.data.success.url,
          width: res.data.success.width,
          height: res.data.success.height,
          name: res.data.success.original_filename,
          publicId: res.data.success.public_id,
          format: res.data.success.format,
        })
        setTags(res.data.success.tags)

        setActiveLayer(activeLayer.count)
        setGenerating(false)
      }
      if (res?.data?.error) {
        setGenerating(false)
      }
    },
  })

  if (!activeLayer.url)
    return (
      <Card
        {...getRootProps()}
        className={cn(
          `hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all  ease-in-out w-full h-full`,
          `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
        )}
      >
        <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24  text-xs ">
          <input {...getInputProps()} />
          <div className="flex items-center flex-col justify-center gap-4">
            <Lottie className="h-48" animationData={cloudAnimation} />
            <p className="text-muted-foreground text-2xl">
              {isDragActive
                ? "Drop your image here!"
                : "Start by uploading an image"}
            </p>
            <p className="text-muted-foreground">
              Supported Formats .jpeg .jpg .png .webp
            </p>
          </div>
        </CardContent>
      </Card>
    )
}
