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
  tags: string[]
  setTags: (tags: string[]) => void
  activeTag: string
  setActiveTag: (tag: string) => void
  activeColor: string
  setActiveColor: (color: string) => void
  generating: boolean
  setGenerating: (generating: boolean) => void
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
    setActiveTag: (tag) => set({ activeTag: tag }),
    activeColor: initialState.activeColor,
    setActiveColor: (color) => set({ activeColor: color }),
    generating: false,
    setGenerating: (generating) => set({ generating }),
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
