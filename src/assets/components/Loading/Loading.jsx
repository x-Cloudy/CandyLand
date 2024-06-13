import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularColor() {
  return (
    <Stack sx={{ color: '#EE688D' }} spacing={2} direction="row">
      <CircularProgress color="inherit" style={{height: "10vw", width: '10vw', minWidth: '70px', minHeight: '70px', maxWidth: '150px', maxHeight: '150px'}} />
    </Stack>
  );
}
