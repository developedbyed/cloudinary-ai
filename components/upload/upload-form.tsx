"use client"

import { uploadImage } from "@/server/upload-image"
import { useImageStore } from "@/lib/store"
import { useAction } from "next-safe-action/hooks"
import { useDropzone } from "react-dropzone"

import { Card, CardContent } from "../ui/card"
import { CloudUpload, ImageUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function UploadForm() {
  const setActiveImage = useImageStore((state) => state.setActiveImage)
  const setTags = useImageStore((state) => state.setTags)
  const setPublicId = useImageStore((state) => state.setPublicId)
  const setGenerating = useImageStore((state) => state.setGenerating)
  const activeImage = useImageStore((state) => state.activeImage)
  const setImageHeight = useImageStore((state) => state.setImageHeight)
  const setImageWidth = useImageStore((state) => state.setImageWidth)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setActiveImage(URL.createObjectURL(acceptedFiles[0]))
      const formData = new FormData()
      formData.append("image", acceptedFiles[0])
      setGenerating(true)
      execute({ image: formData })
    },
  })

  const { execute, status } = useAction(uploadImage, {
    onSuccess: ({ data }) => {
      console.log(data)
      if (data?.success) {
        setActiveImage(data.success.url)
        setPublicId(data.success.public_id)
        setTags(data.success.tags)
        setGenerating(false)
        setImageHeight(data.success.height)
        setImageWidth(data.success.width)
      }
      if (data?.error) {
        setGenerating(false)
        console.log(data.error)
      }
    },
  })
  if (!activeImage)
    return (
      <Card
        {...getRootProps()}
        className={cn(
          `hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all  ease-in-out`,
          `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
        )}
      >
        <CardContent className="flex flex-col items-center justify-center px-2 py-24 text-xs ">
          <input {...getInputProps()} />

          <div className="flex items-center flex-col justify-center gap-4">
            <CloudUpload size={48} className={cn(`text-primary`)} />
            <p className="text-secondary-foreground">
              {isDragActive
                ? "Drop your image here!"
                : "Start by uploading an image"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
}
