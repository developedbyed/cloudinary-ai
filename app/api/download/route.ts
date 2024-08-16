import { NextRequest, NextResponse } from "next/server"
import cloudinary from "cloudinary"
import { checkImageProcessing } from "@/server/url_process"

cloudinary.v2.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cname: process.env.CLOUDINARY_NAME,
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const publicId = searchParams.get("publicId")
  const quality = searchParams.get("quality")
  const resource = searchParams.get("resource_type")
  const format = searchParams.get("format")
  const activeUrl = searchParams.get("url")

  if (!publicId) {
    return new NextResponse("Missing publicId parameter", { status: 400 })
  }

  let selected = ""
  if (format && !format.toLowerCase().endsWith("png")) {
    switch (quality) {
      case "original":
        break
      case "large":
        selected = "q_80"
        break
      case "medium":
        selected = "q_50"
        break
      case "small":
        selected = "q_30"
        break
      default:
        return new NextResponse("Invalid quality parameter", { status: 400 })
    }
  }

  try {
    const parts = activeUrl!.split("/upload/")
    const url = selected
      ? `${parts[0]}/upload/${selected}/${parts[1]}`
      : activeUrl!

    // Poll the URL to check if the image is processed
    let isProcessed = false
    const maxAttempts = 20
    const delay = 1000 // 1 second
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      isProcessed = await checkImageProcessing(url)

      if (isProcessed) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    if (!isProcessed) {
      throw new Error("Image processing timed out")
    }
    return NextResponse.json({
      url,
      filename: `${publicId}.${quality}.${format}`,
    })
  } catch (error) {
    console.error("Error generating image URL:", error)
    return NextResponse.json(
      { error: "Error generating image URL" },
      { status: 500 }
    )
  }
}
