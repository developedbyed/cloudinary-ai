import { createStore } from "zustand/vanilla"
import { StoreApi, useStore } from "zustand"
import React from "react"

const createZustandContext = <TInitial, TStore extends StoreApi<any>>(
  getStore: (initial: TInitial) => TStore
) => {
  const Context = React.createContext(null as any as TStore)

  const Provider = (props: {
    children?: React.ReactNode
    initialValue: TInitial
  }) => {
    const [store] = React.useState(getStore(props.initialValue))

    return <Context.Provider value={store}>{props.children}</Context.Provider>
  }

  return {
    useContext: () => React.useContext(Context),
    Context,
    Provider,
  }
}

type State = {
  activeImage: string
  setActiveImage: (image: string) => void
  tags: string[]
  setTags: (tags: string[]) => void
  activeTag: string
  setActiveTag: (tag: string) => void
  publicId: string
  setPublicId: (publicId: string) => void
  activeColor: string
  setActiveColor: (color: string) => void
  generating: boolean
  setGenerating: (generating: boolean) => void
  imageHeight: number
  imageWidth: number
  setImageHeight: (height: number) => void
  setImageWidth: (width: number) => void
  xCrop: number
  yCrop: number
  setXCrop: (xCrop: number) => void
  setYCrop: (yCrop: number) => void
}

const getStore = (initialState: {
  activeTag: string
  activeColor: string
  activeImage: string
}) => {
  return createStore<State>()((set) => ({
    tags: [],
    activeTag: initialState.activeTag,
    setTags: (tags) => set({ tags }),
    activeImage: initialState.activeImage,
    setActiveImage: (image) => set({ activeImage: image }),
    setActiveTag: (tag) => set({ activeTag: tag }),
    publicId: "",
    setPublicId: (publicId) => set({ publicId }),
    activeColor: initialState.activeColor,
    setActiveColor: (color) => set({ activeColor: color }),
    generating: false,
    setGenerating: (generating) => set({ generating }),
    imageHeight: 0,
    imageWidth: 0,
    setImageHeight: (height) => set({ imageHeight: height }),
    setImageWidth: (width) => set({ imageWidth: width }),
    xCrop: 0,
    yCrop: 0,
    setXCrop: (xCrop) => set({ xCrop }),
    setYCrop: (yCrop) => set({ yCrop }),
  }))
}

export const ImageStore = createZustandContext(getStore)

export function useImageStore<T>(selector: (state: State) => T) {
  const store = React.useContext(ImageStore.Context)
  if (!store) {
    throw new Error("Missing ImageStore provider")
  }
  return useStore(store, selector)
}
