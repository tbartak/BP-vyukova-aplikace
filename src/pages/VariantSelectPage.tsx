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
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Nenalezen platný typ křižovatky.</Typography>
      </Box>
    )
  }

  const scheme = intersectionType.schemes.find(s => s.id === schemeId)
  if (!scheme) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Nenalezeno schéma křižovatky.</Typography>
      </Box>
    )
  }

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant)
    navigate('/detail')
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Vyberte variantu pro {scheme.name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        {scheme.variants.map(variant => (
          <Button
            key={variant.id}
            variant="outlined"
            onClick={() => handleVariantSelect(variant)}
            sx={{
              flexDirection: 'column',
              p: 2,
              width: 220,
              height: 250
            }}
          >
            <img
              src={`/imgs/${variant.id}.jpg`}
              alt={variant.name}
              style={{ width: '200px', height: 'auto' }}
            />
            <Typography variant="button" sx={{ mt: 1 }}>
              {variant.name}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  )
}