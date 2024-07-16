"use server"

import { UploadApiResponse, v2 as cloudinary } from "cloudinary"
import { actionClient } from "@/server/safe-action"
import z from "zod"

cloudinary.config({
  cloud_name: "restyled",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const formData = z.object({
  publicId: z.string(),
})

export const test = actionClient
  .schema(formData)
  .action(async ({ parsedInput: { publicId } }) => {
    console.log("woo")
    try {
      const result = await cloudinary.api.resource(`${publicId}.transcript`, {
        resource_type: "raw",
      })
      console.log(result)
      return { success: result }
    } catch (error) {
      console.log(error)
    }
  })
