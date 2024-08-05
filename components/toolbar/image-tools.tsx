"use client"

import AIRecolor from "@/components/toolbar/recolor"
import GenerativeFill from "@/components/toolbar/generative-fill"
import GenRemove from "@/components/toolbar/gen-remove"

export default function ImageTools() {
  return (
    <>
      <GenerativeFill />
      <AIRecolor />
      <GenRemove />
    </>
  )
}
