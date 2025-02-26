import { useParams, useNavigate } from 'react-router-dom'
import { intersectionConfig } from '../config/variants'
import { Box, Button, Typography } from '@mui/material'

export default function SchemeSelectPage() {
  const { type } = useParams<{ type: 'T' | 'X' }>()
  const navigate = useNavigate()

  const intersectionType = intersectionConfig.find(item => item.type === type)

  if (!intersectionType) {
    return <Box p={3}><Typography>Nenalezen platný typ křižovatky.</Typography></Box>
  }

  const handleSchemeSelect = (schemeId: string) => {
    navigate(`/select-variant/${type}/${schemeId}`)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Vyberte schéma křižovatky typu {type}
      </Typography>
      {intersectionType.schemes.map(scheme => (
        <Box key={scheme.id} sx={{ mb: 2 }}>
          <Typography variant="h6">{scheme.name}</Typography>
          <Button variant="contained" onClick={() => handleSchemeSelect(scheme.id)}>
            Vybrat
          </Button>
        </Box>
      ))}
    </Box>
  )
}