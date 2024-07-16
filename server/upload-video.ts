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
  video: z.instanceof(FormData),
})

type UploadResult =
  | { success: UploadApiResponse; error?: never }
  | { error: string; success?: never }

export const uploadVideo = actionClient
  .schema(formData)
  .action(async ({ parsedInput: { video } }): Promise<UploadResult> => {
    console.log(video)
    const formVideo = video.get("video")

    if (!formVideo) return { error: "No video provided" }
    if (!video) return { error: "No video provided" }

    const file = formVideo as File

    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            upload_preset: "restyled",
            use_filename: true,
            unique_filename: false,
            filename_override: file.name,
          },
          (error, result) => {
            if (error || !result) {
              console.error("Upload failed:", error)
              reject({ error: "Upload failed" })
            } else {
              console.log("Upload successful:", result)
              resolve({ success: result })
            }
          }
        )

        uploadStream.end(buffer)
      })
    } catch (error) {
      console.error("Error processing file:", error)
      return { error: "Error processing file" }
    }
  })
