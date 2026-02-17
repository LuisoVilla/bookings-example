import { useMemo, useState } from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import {
  COLOR_MODE_STORAGE_KEY,
  ColorModeContext,
  type ColorMode,
  type ColorModeContextValue,
} from './colorMode'

function readInitialMode(): ColorMode {
  try {
    const raw = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
    if (raw === 'dark' || raw === 'light') return raw
  } catch {
    // ignore
  }
  return 'light'
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(() => readInitialMode())

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      toggle: () => {
        setMode((prev) => {
          const next: ColorMode = prev === 'light' ? 'dark' : 'light'
          try {
            localStorage.setItem(COLOR_MODE_STORAGE_KEY, next)
          } catch {
            // ignore
          }
          return next
        })
      },
    }),
    [mode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode],
  )

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
