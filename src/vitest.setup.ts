import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  // zustand/persist writes to localStorage; keep tests isolated
  localStorage.clear()
})
