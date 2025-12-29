import { create } from 'zustand'

interface StoreState {
  spawnCall: boolean
  showReset: boolean
  callReset: boolean
  showInfo: boolean
  setSpawnCall: (value: boolean) => void
  setShowInfo: (value: boolean) => void
  setShowReset: (value: boolean) => void
  setCallReset: (value: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
  spawnCall: false,
  showReset:false,
  callReset:false,
  showInfo:true,
  setSpawnCall: (value) => set({ spawnCall: value }),
  setShowInfo: (value) => set({ showInfo: value }),
  setShowReset: (value) => set({ showReset: value }),
  setCallReset: (value) => set({ callReset: value }),
}))

