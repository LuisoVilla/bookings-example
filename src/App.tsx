import { useMemo, useState } from 'react'
import { Box, Button, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { BookingsPage } from './bookings/BookingsPage'
import { getAuthenticatedUsername, isAuthenticated, logout } from './auth/auth'
import { LoginPage } from './auth/LoginPage'
import { useColorMode } from './theme/colorMode'

export default function App() {
  const [authed, setAuthed] = useState(() => isAuthenticated())
  const { mode, toggle } = useColorMode()

  const username = useMemo(() => (authed ? getAuthenticatedUsername() : null), [authed])

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />
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
