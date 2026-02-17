import type { ReactElement } from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render } from '@testing-library/react'

type Options = {
  withCssBaseline?: boolean
}

const theme = createTheme()

export function renderWithMUI(ui: ReactElement, options?: Options) {
  const withCssBaseline = options?.withCssBaseline ?? true

  return render(
    <ThemeProvider theme={theme}>
      {withCssBaseline ? <CssBaseline /> : null}
      {ui}
    </ThemeProvider>,
  )
}
