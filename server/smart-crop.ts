"use server"

import { UploadApiResponse, v2 as cloudinary } from "cloudinary"
import { actionClient } from "@/server/safe-action"
import z from "zod"

cloudinary.config({
  cloud_name: "restyled",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const genFillSchema = z.object({
  activeVideo: z.string(),
  aspect: z.string(),
  height: z.string(),
})

async function checkImageProcessing(url: string) {
  try {
    const response = await fetch(url)
    if (response.ok) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

export const genCrop = actionClient
  .schema(genFillSchema)
  .action(async ({ parsedInput: { activeVideo, aspect, height } }) => {
    const parts = activeVideo.split("/upload/")
    //https://res.cloudinary.com/demo/image/upload/ar_16:9,b_gen_fill,c_pad,w_1500/docs/moped.jpg
    const fillUrl = `${parts[0]}/upload/ar_${aspect},c_fill,g_auto,h_${height}/${parts[1]}`
    // Poll the URL to check if the image is processed
    let isProcessed = false
    const maxAttempts = 20
    const delay = 1000 // 1 second
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      isProcessed = await checkImageProcessing(fillUrl)
      if (isProcessed) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    if (!isProcessed) {
      return { error: "Video processing failed" }
    }
    console.log(fillUrl)
    return { success: fillUrl }
  })
