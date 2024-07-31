"use client"

import Editor from "@/components/editor"
import { LayerStore } from "@/lib/layer-store"
import { ImageStore } from "@/lib/store"
export default function Home() {
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
        <main className="h-full">
          <Editor />
        </main>
      </LayerStore.Provider>
    </ImageStore.Provider>
  )
}
