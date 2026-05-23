import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NetworkMode = "somnia";

type NetworkState = {
  mode: NetworkMode;
  setMode: (mode: NetworkMode) => void;
};

export const useNetwork = create<NetworkState>()(
  persist(
    (set) => ({
      mode: "somnia",
      setMode: () => set({ mode: "somnia" }),
    }),
    {
      name: "arcpay-somnia-network",
      version: 1,
      partialize: () => ({ mode: "somnia" as const }),
    },
  ),
);
