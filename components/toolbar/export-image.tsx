"use client"

import { useLayerStore } from "@/lib/layer-store"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Download } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ExportAsset({ resource }: { resource: string }) {
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const [selected, setSelected] = useState("original")
  const handleDownload = async () => {
    if (activeLayer?.publicId) {
      try {
        const res = await fetch(
          `/api/download?publicId=${activeLayer.publicId}&quality=${selected}&resource_type=${activeLayer.resourceType}&format=${activeLayer.format}&url=${activeLayer.url}`
        )
        if (!res.ok) {
          throw new Error("Failed to fetch image URL")
        }
        const data = await res.json()
        console.log(data)
        if (data.error) {
          throw new Error(data.error)
        }

        // Fetch the image
        const imageResponse = await fetch(data.url)
        if (!imageResponse.ok) {
          throw new Error("Failed to fetch image")
        }
        const imageBlob = await imageResponse.blob()

        // Create a download link and trigger the download
        const downloadUrl = URL.createObjectURL(imageBlob)
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up the object URL
        URL.revokeObjectURL(downloadUrl)
      } catch (error) {
        console.error("Download failed:", error)
        // Here you could show an error message to the user
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            Export
            <Download size={18} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div>
          <h3 className="text-center text-2xl font-medium pb-4">Export</h3>
          <div className="flex flex-col gap-4">
            <Card
              onClick={() => setSelected("original")}
              className={cn(
                selected === "original" ? "border-primary" : null,
                "p-4 cursor-pointer"
              )}
            >
              <CardContent className="p-0">
                <CardTitle className="text-md">Original</CardTitle>
                <CardDescription>
                  {activeLayer.width}X{activeLayer.height}
                </CardDescription>
              </CardContent>
            </Card>
            <Card
              onClick={() => setSelected("large")}
              className={cn(
                selected === "large" ? "border-primary" : null,
                "p-4 cursor-pointer"
              )}
            >
              <CardContent className="p-0">
                <CardTitle className="text-md">Large</CardTitle>
                <CardDescription>
                  {(activeLayer.width! * 0.7).toFixed(0)}X
                  {(activeLayer.height! * 0.7).toFixed(0)}
                </CardDescription>
              </CardContent>
            </Card>
            <Card
              onClick={() => setSelected("medium")}
              className={cn(
                selected === "medium" ? "border-primary" : null,
                "p-4 cursor-pointer"
              )}
            >
              <CardContent className="p-0">
                <CardTitle className="text-md">Medium</CardTitle>
                <CardDescription>
                  {(activeLayer.width! * 0.5).toFixed(0)}X
                  {(activeLayer.height! * 0.5).toFixed(0)}
                </CardDescription>
              </CardContent>
            </Card>
            <Card
              className={cn(
                selected === "small" ? "border-primary" : null,
                "p-4 cursor-pointer"
              )}
              onClick={() => setSelected("small")}
            >
              <CardContent className="p-0">
                <CardTitle className="text-md">Small</CardTitle>
                <CardDescription>
                  {(activeLayer.width! * 0.3).toFixed(0)}X
                  {(activeLayer.height! * 0.3).toFixed(0)}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
        <Button onClick={handleDownload}>
          Download {selected} {resource}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
