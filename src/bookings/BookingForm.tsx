import { useState } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import type { BookingDraft } from './types'

type Props = {
  mode: 'create' | 'edit'
  initialDraft: BookingDraft
  onSubmit: (draft: BookingDraft) => void
  onCancel?: () => void
  wrapInPaper?: boolean
}

export function BookingForm({
  mode,
  initialDraft,
  onSubmit,
  onCancel,
  wrapInPaper = true,
}: Props) {
  const [draft, setDraft] = useState<BookingDraft>(initialDraft)

  function onChange<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const isEdit = mode === 'edit'

  const content = (
    <Stack spacing={2}>
      <Typography variant="h6">{isEdit ? 'Edit booking' : 'Create booking'}</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Start date"
          type="date"
          value={draft.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="End date"
          type="date"
          value={draft.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button variant="contained" onClick={() => onSubmit(draft)}>
          {isEdit ? 'Update booking' : 'Create booking'}
        </Button>
        {isEdit ? (
          <Button variant="text" onClick={onCancel}>
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
