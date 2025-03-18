import { create } from 'zustand'

interface StoreState {
  spawnCall: boolean
  showReset: boolean
  callReset:boolean
  setSpawnCall: (value: boolean) => void
  setShowReset: (value: boolean) => void
  setCallReset: (value: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
  spawnCall: false,
  showReset:false,
  callReset:false,
  setSpawnCall: (value) => set({ spawnCall: value }),
  setShowReset: (value) => set({ showReset: value }),
  setCallReset: (value) => set({ callReset: value }),
}))

