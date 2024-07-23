"use client"

import AIRecolor from "@/components/toolbar/recolor"
import GenerativeFill from "@/components/toolbar/generative-fill"
import GenRemove from "@/components/toolbar/gen-remove"
import { ModeToggle } from "../toggle"

export default function ImageTools() {
  return (
    <div className="py-12 px-4 flex flex-col gap-4">
      <div className="pb-12 text-center">
        <ModeToggle />
      </div>
      <AIRecolor />
      <GenerativeFill />
      <GenRemove />
    </div>
  )
}
