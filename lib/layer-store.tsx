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

type Layer = {
  publicId?: string
  width?: number
  height?: number
  url?: string
  count: number
  name?: string
  format?: string
}

type State = {
  layers: Layer[]
  addLayer: (layer: Layer) => void
  removeLayer: (count: number) => void
  setActiveLayer: (count: number) => void
  activeLayer: Layer
  updateLayer: (layer: Layer) => void
}

const getStore = (initialState: { layers: Layer[] }) => {
  return createStore<State>()((set) => ({
    layers: initialState.layers,
    addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
    removeLayer: (count: number) =>
      set((state) => ({
        layers: state.layers.filter((l) => l.count !== count),
      })),
    setActiveLayer: (count: number) =>
      set((state) => ({
        activeLayer: state.layers.find((l) => l.count === count),
      })),
    activeLayer: initialState.layers[0],
    updateLayer: (layer) =>
      set((state) => {
        const layers = state.layers.map((l) =>
          l.count === layer.count ? layer : l
        )
        return { layers }
      }),
  }))
}

export const LayerStore = createZustandContext(getStore)

export function useLayerStore<T>(selector: (state: State) => T) {
  const store = React.useContext(LayerStore.Context)
  if (!store) {
    throw new Error("Missing ImageStore provider")
  }
  return useStore(store, selector)
}
