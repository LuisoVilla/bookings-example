import { useMemo, useState } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { BookingsPage } from './bookings/BookingsPage'
import { getAuthenticatedUsername, isAuthenticated, logout } from './auth/auth'
import { LoginPage } from './auth/LoginPage'

export default function App() {
  const [authed, setAuthed] = useState(() => isAuthenticated())

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
          <Button
            variant="text"
            onClick={() => {
              logout()
              setAuthed(false)
            }}
          >
            Logout
          </Button>
        </Box>
      </Container>
      <BookingsPage />
    </Stack>
  )
}
