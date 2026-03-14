import { create } from 'zustand'

const useScanStore = create((set) => ({
  currentJob: null,
  progress: null,
  result: null,
  isScanning: false,

  setJob: (job) => set({ currentJob: job, isScanning: true }),
  setProgress: (progress) => set({ progress }),
  setResult: (result) => set({ result, isScanning: false }),
  reset: () => set({ currentJob: null, progress: null, result: null, isScanning: false }),
}))

export default useScanStore
