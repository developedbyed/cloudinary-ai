"use client"

import { useImageStore } from "@/lib/store"
import Image from "next/image"
import { Cloudinary } from "@cloudinary/url-gen"
import { generativeRecolor } from "@cloudinary/url-gen/actions/effect"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Button } from "./ui/button"

export default function ActiveImage() {
  const activeImage = useImageStore((state) => state.activeImage)
  const generating = useImageStore((state) => state.generating)
  const setActiveImage = useImageStore((state) => state.setActiveImage)

  if (activeImage)
    return (
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger>
            <div className="relative w-80  h-96 border-2">
              <div className="bg-black  w-24   z-50">hsdf</div>
              <Image
                alt="active-image"
                src={activeImage}
                fill={true}
                className={cn("", generating ? "animate-pulse" : "")}
              />
              <div className="bg-black  w-72   z-50">hsdf</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <Button variant={"ghost"} onClick={() => setActiveImage("")}>
              Replace Image
            </Button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
}

{
  /* <div className="w-full">
        
<div
  className="w-[600px] h-[600px]"
  dangerouslySetInnerHTML={{ __html: recoloredImage }}
></div>
</div> */
}
