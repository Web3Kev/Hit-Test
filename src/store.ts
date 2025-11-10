import { Quaternion, Vector3 } from 'three'
import { create } from 'zustand'

type Duck = { position: Vector3; quaternion: Quaternion }

interface StoreState {
  ducks: Duck[]
  spawnCall: boolean
  showReset: boolean
  callReset: boolean
  setDucks: (ducks: Duck[]) => void
  addDuck: (duck: Duck) => void
  setSpawnCall: (value: boolean) => void
  setShowReset: (value: boolean) => void
  setCallReset: (value: boolean) => void
  resetAll: () => void
}

export const useStore = create<StoreState>((set) => ({
  ducks: [],
  spawnCall: false,
  showReset:false,
  callReset:false,
  setDucks: (ducks) => set({ ducks }), //redundant
  addDuck: (duck) => set((state) => ({
    ducks: [...state.ducks, duck],
  })),
  setSpawnCall: (value) => set({ spawnCall: value }),
  setShowReset: (value) => set({ showReset: value }),
  setCallReset: (value) => set({ callReset: value }),

  resetAll: () =>
    set({
      ducks: [],
      spawnCall: false,
      showReset: false,
      callReset: false,
    }),
}))

