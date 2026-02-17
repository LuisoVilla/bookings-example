import { useState } from 'react'
import { Alert, Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import { DEFAULT_PASSWORD, DEFAULT_USERNAME, login } from './auth'

type Props = {
  onSuccess: () => void
}

export function LoginPage({ onSuccess }: Props) {
  const [username, setUsername] = useState(DEFAULT_USERNAME)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const result = login(username.trim(), password)
    if (!result.ok) {
      setError(result.error)
      setSubmitting(false)
      return
    }

    onSuccess()
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage bookings.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          inputProps={{ 'aria-label': 'username' }}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          inputProps={{ 'aria-label': 'password' }}
        />

        <Button type="submit" variant="contained" disabled={submitting}>
          Sign in
        </Button>
      </Stack>
    </Container>
  )
}
