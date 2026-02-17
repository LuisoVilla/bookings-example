import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Booking, BookingDraft, BookingId } from './types'
import { validateDraft, validateNoOverlap } from './validation'

type BookingResult =
  | { ok: true; bookingId: BookingId }
  | { ok: false; error: string }

type BookingState = {
  bookings: Booking[]
  selectedId: BookingId | null
  selectBooking: (id: BookingId | null) => void
  createBooking: (draft: BookingDraft) => BookingResult
  updateBooking: (id: BookingId, draft: BookingDraft) => BookingResult
  deleteBooking: (id: BookingId) => void
}

export const useBookingsStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      selectedId: null,

      selectBooking: (id) => set({ selectedId: id }),

      createBooking: (draft) => {
        const draftError = validateDraft(draft)
        if (draftError) return { ok: false, error: draftError }

        const overlapError = validateNoOverlap(draft, get().bookings)
        if (overlapError) return { ok: false, error: overlapError }

        const now = Date.now()
        const booking: Booking = {
          id: nanoid(),
          startDate: draft.startDate,
          endDate: draft.endDate,
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({ bookings: [...state.bookings, booking] }))
        return { ok: true, bookingId: booking.id }
      },

      updateBooking: (id, draft) => {
        const draftError = validateDraft(draft)
        if (draftError) return { ok: false, error: draftError }

        const overlapError = validateNoOverlap(draft, get().bookings, id)
        if (overlapError) return { ok: false, error: overlapError }

        const now = Date.now()
        const existing = get().bookings.find((b) => b.id === id)
        if (!existing) return { ok: false, error: 'Booking not found.' }

        const updated: Booking = {
          ...existing,
          startDate: draft.startDate,
          endDate: draft.endDate,
          updatedAt: now,
        }

        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        }))

        return { ok: true, bookingId: id }
      },

      deleteBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        }))
      },
    }),
    {
      name: 'booking-example.bookings',
      version: 1,
      partialize: (state) => ({ bookings: state.bookings }),
    },
  ),
)
