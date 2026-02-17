import { createContext, useContext } from 'react'

export type ColorMode = 'light' | 'dark'

export type ColorModeContextValue = {
  mode: ColorMode
  toggle: () => void
}

export const COLOR_MODE_STORAGE_KEY = 'booking-example.color-mode'

export const ColorModeContext = createContext<ColorModeContextValue | null>(null)

export function useColorMode() {
  const ctx = useContext(ColorModeContext)
  if (!ctx) throw new Error('useColorMode must be used within ColorModeProvider')
  return ctx
}
