import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import type { BookingDraft } from './types'

type Props = {
  mode: 'create' | 'edit'
  initialDraft: BookingDraft
  onSubmit: (draft: BookingDraft) => void | Promise<void>
  onCancel?: () => void
  wrapInPaper?: boolean
  validate?: (draft: BookingDraft) => string | null
  startDateInputId?: string
}

export function BookingForm({
  mode,
  initialDraft,
  onSubmit,
  onCancel,
  wrapInPaper = true,
  validate,
  startDateInputId,
}: Props) {
  const [draft, setDraft] = useState<BookingDraft>(initialDraft)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  function onChange<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
    if (formError) setFormError(null)
  }

  const isEdit = mode === 'edit'

  const startRequiredError = submitAttempted && !draft.startDate ? 'Start date is required.' : null
  const endRequiredError = submitAttempted && !draft.endDate ? 'End date is required.' : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitAttempted(true)

    const currentError = validate ? validate(draft) : null
    if (currentError) {
      setFormError(currentError)
      return
    }

    setFormError(null)

    setSubmitting(true)
    try {
      await onSubmit(draft)
    } finally {
      setSubmitting(false)
    }
  }

  const content = (
    <Stack spacing={2} component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6">{isEdit ? 'Edit booking' : 'Create booking'}</Typography>

      {submitAttempted && formError ? <Alert severity="error">{formError}</Alert> : null}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Start date"
          type="date"
          value={draft.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          error={Boolean(startRequiredError)}
          helperText={startRequiredError ?? ' '}
          inputProps={startDateInputId ? { id: startDateInputId } : undefined}
        />
        <TextField
          label="End date"
          type="date"
          value={draft.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          error={Boolean(endRequiredError)}
          helperText={endRequiredError ?? ' '}
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button
          variant="contained"
          type="submit"
          disabled={submitting || (submitAttempted && Boolean(formError))}
        >
          {isEdit ? 'Update booking' : 'Create booking'}
        </Button>
        {isEdit ? (
          <Button variant="text" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        ) : null}
      </Stack>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Note: ranges are treated as inclusive (start and end dates included).
        </Typography>
      </Box>
    </Stack>
  )

  if (!wrapInPaper) return content

  return <Paper variant="outlined" sx={{ p: 2 }}>{content}</Paper>
}
