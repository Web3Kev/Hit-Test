import { create } from 'zustand'

interface SpawnState {
  spawnCall: boolean
  setSpawnCall: (value: boolean) => void
}

export const useSpawnStore = create<SpawnState>((set) => ({
  spawnCall: false,
  setSpawnCall: (value) => set({ spawnCall: value }),
}))