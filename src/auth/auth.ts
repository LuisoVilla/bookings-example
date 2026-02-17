export const DEFAULT_USERNAME = 'user'
export const DEFAULT_PASSWORD = '123456'

const AUTH_STORAGE_KEY = 'booking-example.auth.v1'

type AuthSession = {
  username: string
  loggedInAt: number
}

export function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as Partial<AuthSession>
    return typeof parsed.username === 'string' && typeof parsed.loggedInAt === 'number'
  } catch {
    return false
  }
}

export function getAuthenticatedUsername(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AuthSession>
    return typeof parsed.username === 'string' ? parsed.username : null
  } catch {
    return null
  }
}

export function login(username: string, password: string): { ok: true } | { ok: false; error: string } {
  if (username !== DEFAULT_USERNAME || password !== DEFAULT_PASSWORD) {
    return { ok: false, error: 'Invalid username or password.' }
  }

  const session: AuthSession = {
    username,
    loggedInAt: Date.now(),
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  return { ok: true }
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
