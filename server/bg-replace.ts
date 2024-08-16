"use server"

import { v2 as cloudinary } from "cloudinary"
import { actionClient } from "@/server/safe-action"
import z from "zod"

cloudinary.config({
  cloud_name: "restyled",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const bgReplaceSchema = z.object({
  prompt: z.string().optional(),
  activeImage: z.string(),
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

export const replaceBackground = actionClient
  .schema(bgReplaceSchema)
  .action(async ({ parsedInput: { prompt, activeImage } }) => {
    const parts = activeImage.split("/upload/")
    const bgReplaceUrl = prompt
      ? `${
          parts[0]
        }/upload/e_gen_background_replace:prompt_${encodeURIComponent(
          prompt
        )}/${parts[1]}`
      : `${parts[0]}/upload/e_gen_background_replace/${parts[1]}`

    // Poll the URL to check if the image is processed
    let isProcessed = false
    const maxAttempts = 20
    const delay = 1000 // 1 second
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      isProcessed = await checkImageProcessing(bgReplaceUrl)
      if (isProcessed) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    if (!isProcessed) {
      throw new Error("Image processing timed out")
    }
    console.log(bgReplaceUrl)
    return { success: bgReplaceUrl }
  })
