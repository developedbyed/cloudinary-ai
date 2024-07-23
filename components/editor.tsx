"use client"
import { ImageStore } from "@/lib/store"
import UploadForm from "./upload/upload-form"
import ActiveImage from "./active-image"

import { LayerStore } from "@/lib/layer-store"
import Layers from "./layers"
import ImageTools from "./toolbar/image-tools"
import VideoTools from "./toolbar/video-tools"
import { ModeToggle } from "./toggle"

export default function Editor() {
  return (
    <ImageStore.Provider
      initialValue={{
        activeTag: "all",
        activeColor: "green",
        activeImage: "",
      }}
    >
      <LayerStore.Provider
        initialValue={{
          layerComparisonMode: false,
          layers: [
            {
              id: crypto.randomUUID(),
              url: "",
              height: 0,
              width: 0,
              publicId: "",
            },
          ],
        }}
      >
        <div className="flex h-full">
          {/* <VideoTools /> */}
          <ImageTools />
          <ActiveImage />
          <UploadForm />
          <Layers />
        </div>
      </LayerStore.Provider>
    </ImageStore.Provider>
  )
}
// https://res.cloudinary.com/restyled/image/upload/v1719765196/restyled/ec7fbftqo0cqxilfaz80.jpg
