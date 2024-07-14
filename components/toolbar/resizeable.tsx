"use client"

import React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useImageStore } from "@/lib/store"

export default function Resizable() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const setImageHeight = useImageStore((state) => state.setImageHeight)
  const setImageWidth = useImageStore((state) => state.setImageWidth)

  const handleDragEnd = (e) => {}

  return (
    <motion.div className="border-4 relative w-full h-full ">
      {/* Right overlay */}
      <motion.div
        className=" top-0 h-full bg-black opacity-50 flex items-center justify-center text-white text-lg"
        style={{
          width: useTransform(x, (latest) => Math.max(0, latest)),
        }}
      >
        {useTransform(x, (latest) =>
          latest > 0 ? `+${Math.round(latest)}px` : ""
        )}
      </motion.div>
      <motion.div
        className=" top-0 h-full bg-black opacity-50 flex items-center justify-center text-white text-lg"
        style={{
          width: useTransform(x, (latest) => Math.max(0, -latest)),
        }}
      >
        {useTransform(x, (latest) =>
          latest > 0 ? `+${Math.round(latest)}px` : ""
        )}
      </motion.div>
      {/* Right resize handle */}
      <motion.div
        className="absolute right-0 top-0 w-2 h-full cursor-ew-resize bg-orange-600"
        drag="x"
        dragConstraints={{ left: 0 }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        style={{ x }}
      />

      {/* Top resize handle */}
      <motion.div
        className="absolute left-0 top-0 w-full h-2 z-50 cursor-ns-resize bg-orange-600"
        drag="y"
        dragConstraints={{ bottom: 0 }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        style={{ y }}
      />
      <motion.div
        className="absolute w-full left-0 bg-black opacity-50 flex items-center justify-center text-white text-lg"
        style={{
          top: useTransform(y, (latest) => Math.min(0, latest)),
          height: useTransform(y, (latest) => Math.max(0, -latest)),
        }}
      >
        {useTransform(y, (latest) =>
          latest < 0 ? `+${Math.round(-latest)}px` : ""
        )}
      </motion.div>
      <motion.div
        className="absolute w-full left-0 bg-black opacity-50 flex items-center justify-center text-white text-lg"
        style={{
          bottom: useTransform(y, (latest) => Math.min(0, latest)),
          height: useTransform(y, (latest) => Math.max(0, -latest)),
        }}
      >
        {useTransform(y, (latest) =>
          latest < 0 ? `+${Math.round(-latest)}px` : ""
        )}
      </motion.div>

      {/* Border around the original image */}
      <div className="absolute inset-0  border border-primary pointer-events-none" />
    </motion.div>
  )
}
