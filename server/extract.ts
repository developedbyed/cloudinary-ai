"use server"

import { v2 as cloudinary } from "cloudinary"
import { actionClient } from "@/server/safe-action"
import z from "zod"

cloudinary.config({
  cloud_name: "restyled",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const extractSchema = z.object({
  prompts: z.array(z.string()),
  activeImage: z.string(),
  multiple: z.boolean().optional(),
  mode: z.enum(["default", "mask"]).optional(),
  invert: z.boolean().optional(),
  format: z.string(),
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

export const extractImage = actionClient
  .schema(extractSchema)
  .action(
    async ({
      parsedInput: { prompts, activeImage, multiple, mode, invert, format },
    }) => {
      const form = activeImage.split(format)
      const pngConvert = form[0] + "png"
      const parts = pngConvert.split("/upload/")

      let extractParams = `prompt_(${prompts
        .map((p) => encodeURIComponent(p))
        .join(";")})`
      if (multiple) extractParams += ";multiple_true"
      if (mode === "mask") extractParams += ";mode_mask"
      if (invert) extractParams += ";invert_true"

      const extractUrl = `${parts[0]}/upload/e_extract:${extractParams}/${parts[1]}`

      // Poll the URL to check if the image is processed
      let isProcessed = false
      const maxAttempts = 20
      const delay = 1000 // 1 second
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        isProcessed = await checkImageProcessing(extractUrl)
        if (isProcessed) {
          break
        }
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      if (!isProcessed) {
        throw new Error("Image processing timed out")
      }
      console.log(extractUrl)
      return { success: extractUrl }
    }
  )
