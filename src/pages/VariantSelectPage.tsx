/**
 * @file VariantSelectPage.tsx
 * @author Tomáš Barták
 * @description
 * Tato stránka slouží k výběru varianty křižovatky na základě zvoleného typu (T nebo X) a schématu.
 */
import { useParams, useNavigate } from 'react-router-dom'
import { intersectionConfig } from '../config/variants'
import { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { Box, Button, Typography } from '@mui/material'
import BreadcrumbsNav from '../components/BreadcrumbsNav'

/**
 * Stránka pro výběr varianty křižovatky na základě zvoleného typu (T nebo X) a schématu.
 */
export default function VariantSelectPage() {
  const { type, schemeId } = useParams<{ type: 'T' | 'X'; schemeId: string }>()
  const navigate = useNavigate()
  const { setSelectedType, setSelectedScheme, setSelectedVariant } = useContext(AppContext)

  // Aktualizace kontextu při načtení stránky
  useEffect(() => {
    if (type && schemeId) {
      setSelectedType(type as 'T' | 'X');
      setSelectedScheme(schemeId);
      setSelectedVariant(null);
    }
  }, [type, schemeId, setSelectedType, setSelectedScheme]);

  // Pokud není nalezen typ křižovatky, zobrazí se chybová zpráva
  const intersectionType = intersectionConfig.find(item => item.type === type)
  if (!intersectionType) {
    return (
      <Box sx={{ p: 3 }}>
        <BreadcrumbsNav />
        <Typography>Nenalezen platný typ křižovatky.</Typography>
      </Box>
    )
  }
  // Pokud není nalezeno schéma křižovatky, zobrazí se chybová zpráva
  const scheme = intersectionType.schemes.find(s => s.id === schemeId)
  if (!scheme) {
    return (
      <Box sx={{ p: 3 }}>
        <BreadcrumbsNav />
        <Typography>Nenalezeno schéma křižovatky.</Typography>
      </Box>
    )
  }

  // Handler pro výběr konkrétního schématu
  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant)
    navigate('/detail')
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <BreadcrumbsNav />
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
              src={`/imgs/${variant.id}.png`}
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