"use client"
import { ImageStore } from "@/lib/store"
import UploadForm from "./upload/upload-form"
import ActiveImage from "./active-image"
import AIRecolor from "./recolor"
import GenerativeFill from "./generative-fill"
import GenRemove from "./gen-remove"

export default function Editor() {
  return (
    <ImageStore.Provider
      initialValue={{
        activeTag: "all",
        activeColor: "green",
        activeImage:
          "https://res.cloudinary.com/restyled/image/upload/v1719856697/restyled/pinatdg7tjdsjmnbol0n.jpg",
      }}
    >
      <div className="">
        <h1 className="text-4xl pb-12 font-bold text-center">AI Editor ✨</h1>
        <div className="flex gap-4 my-4">
          <AIRecolor />
          <GenerativeFill />
          <GenRemove />
        </div>
        <UploadForm />
        <ActiveImage />
      </div>
    </ImageStore.Provider>
  )
}
// https://res.cloudinary.com/restyled/image/upload/v1719765196/restyled/ec7fbftqo0cqxilfaz80.jpg
