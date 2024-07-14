"use client"
import { ImageStore } from "@/lib/store"
import UploadForm from "./upload/upload-form"
import ActiveImage from "./active-image"
import AIRecolor from "@/components/toolbar/recolor"
import GenerativeFill from "@/components/toolbar/generative-fill"
import GenRemove from "@/components/toolbar/gen-remove"
import { LayerStore } from "@/lib/layer-store"
import Layers from "./layers"

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
          layers: [
            {
              count: 1,
              url: "",
              height: 0,
              width: 0,
              publicId: "",
            },
          ],
        }}
      >
        <div className="">
          <div>
            <div className="flex gap-4 my-4  justify-center py-4">
              <AIRecolor />
              <GenerativeFill />
              <GenRemove />
            </div>
            <div className="flex gap-4 w-[1280px] max-h-[620px] ">
              <ActiveImage />
              <UploadForm />
              <Layers />
            </div>
          </div>
        </div>
      </LayerStore.Provider>
    </ImageStore.Provider>
  )
}
// https://res.cloudinary.com/restyled/image/upload/v1719765196/restyled/ec7fbftqo0cqxilfaz80.jpg
