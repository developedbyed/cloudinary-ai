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
  activeImage: z.string(),
  aspect: z.string(),
  width: z.string(),
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

export const genFill = actionClient
  .schema(genFillSchema)
  .action(async ({ parsedInput: { activeImage, aspect, width, height } }) => {
    const parts = activeImage.split("/upload/")
    //https://res.cloudinary.com/demo/image/upload/ar_16:9,b_gen_fill,c_pad,w_1500/docs/moped.jpg
    const fillUrl = `${parts[0]}/upload/ar_${aspect},b_gen_fill,c_pad,w_${width},h_${height}/${parts[1]}`
    console.log(fillUrl)
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
      throw new Error("Image processing timed out")
    }
    console.log(fillUrl)
    return { success: fillUrl }
  })
