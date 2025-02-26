import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Wizard from '../components/GraphWizard/Wizard'
import { Box, Typography } from '@mui/material'

export default function DetailPage() {
  const { selectedVariant } = useContext(AppContext)

  if (!selectedVariant) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Nebyla vybrána žádná varianta.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {selectedVariant.name}
      </Typography>
      <Wizard steps={selectedVariant.steps} />
    </Box>
  )
}