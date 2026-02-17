export type BookingId = string

export type Booking = {
  id: BookingId
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  createdAt: number
  updatedAt: number
}

export type BookingDraft = {
  startDate: string
  endDate: string
}
