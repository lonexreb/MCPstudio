import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingStore {
  isOnboardingDone: boolean;
  currentStep: number;
  isTourActive: boolean;
  setOnboardingDone: () => void;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  resetTour: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isOnboardingDone: false,
      currentStep: 0,
      isTourActive: false,
      setOnboardingDone: () => set({ isOnboardingDone: true, isTourActive: false }),
      startTour: () => set({ isTourActive: true, currentStep: 0 }),
      nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
      prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
      skipTour: () => set({ isOnboardingDone: true, isTourActive: false, currentStep: 0 }),
      resetTour: () => set({ isOnboardingDone: false, currentStep: 0, isTourActive: false }),
    }),
    { name: 'mcp-onboarding' }
  )
);
