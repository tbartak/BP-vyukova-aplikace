import { useParams, useNavigate } from 'react-router-dom'
import { intersectionConfig } from '../config/variants'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Box, Button, Typography } from '@mui/material'

export default function VariantSelectPage() {
  const { type, schemeId } = useParams<{ type: 'T' | 'X'; schemeId: string }>()
  const navigate = useNavigate()
  const { setSelectedVariant } = useContext(AppContext)

  const intersectionType = intersectionConfig.find(item => item.type === type)
  if (!intersectionType) {
    return <Box p={3}><Typography>Nenalezen platný typ křižovatky.</Typography></Box>
  }
  const scheme = intersectionType.schemes.find(s => s.id === schemeId)
  if (!scheme) {
    return <Box p={3}><Typography>Nenalezeno schéma křižovatky.</Typography></Box>
  }

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant)
    navigate('/detail')
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Vyberte variantu pro {scheme.name}
      </Typography>
      {scheme.variants.map(variant => (
        <Box key={variant.id} sx={{ mb: 1 }}>
          <Button variant="outlined" onClick={() => handleVariantSelect(variant)}>
            {variant.name}
          </Button>
        </Box>
      ))}
    </Box>
  )
}