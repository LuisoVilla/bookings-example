import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { BookingsPage } from './bookings/BookingsPage'
import { getAuthenticatedUsername, isAuthenticated, logout } from './auth/auth'
import { LoginPage } from './auth/LoginPage'
import { useColorMode } from './theme/colorMode'

export default function App() {
  const [authed, setAuthed] = useState(() => isAuthenticated())
  const [loginTransitioning, setLoginTransitioning] = useState(false)
  const { mode, toggle } = useColorMode()

  const username = useMemo(() => (authed ? getAuthenticatedUsername() : null), [authed])

  useEffect(() => {
    if (!loginTransitioning) return
    const t = window.setTimeout(() => setLoginTransitioning(false), 2000)
    return () => window.clearTimeout(t)
  }, [loginTransitioning])

  if (!authed) {
    return (
      <LoginPage
        onSuccess={() => {
          setLoginTransitioning(true)
          setAuthed(true)
        }}
      />
    )
  }

  if (loginTransitioning) {
    return (
      <Container maxWidth="xs" sx={{ py: 10 }}>
        <Stack spacing={2.5} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Signing you in…
          </Typography>
        </Stack>
      </Container>
    )
  }

  return (
    <Stack>
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Signed in{username ? ` as ${username}` : ''}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton aria-label="toggle color mode" onClick={toggle}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Button
              variant="text"
              onClick={() => {
                logout()
                setLoginTransitioning(false)
                setAuthed(false)
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Container>
      <BookingsPage />
    </Stack>
  )
}
