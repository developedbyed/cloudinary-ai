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
  image: z.instanceof(FormData),
})

export const uploadImage = actionClient
  .schema(formData)
  .action(async ({ parsedInput: { image } }) => {
    console.log(image)
    const formImage = image.get("image")
    if (!formImage) return { error: "No image provided" }
    if (!image) return { error: "No image provided" }
    const file = formImage as File
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const uploadedImage: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              upload_preset: "restyled",
              // categorization: "imagga_tagging",
              // auto_tagging: 0.8,
            },
            (error, success) => {
              if (error) {
                reject(error)
                return { error: error }
              }
              resolve(success)
              return { success: success }
            }
          )
          .end(buffer)
      }
    )

    return { success: uploadedImage }
  })
