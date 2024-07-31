"use client"

import AIRecolor from "@/components/toolbar/recolor"
import GenerativeFill from "@/components/toolbar/generative-fill"
import GenRemove from "@/components/toolbar/gen-remove"
import { ModeToggle } from "../toggle"

export default function ImageTools() {
  return (
    <>
      <AIRecolor />
      <GenerativeFill />
      <GenRemove />
    </>
  )
}
