import { useParams, useNavigate } from 'react-router-dom'
import { intersectionConfig } from '../config/variants'
import { Box, Button, Typography } from '@mui/material'
import BreadcrumbsNav from '../components/BreadcrumbsNav'
import { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

export default function SchemeSelectPage() {
  const { type } = useParams<{ type: 'T' | 'X' }>()
  const navigate = useNavigate()
  const { setSelectedType, setSelectedScheme, setSelectedVariant } = useContext(AppContext);

  // Aktualizace kontextu při načtení stránky
  useEffect(() => {
    if (type) {
      setSelectedType(type as 'T' | 'X');
      setSelectedScheme(null);
      setSelectedVariant(null);
    }
  }, [type, setSelectedType, setSelectedScheme]);

  const intersectionType = intersectionConfig.find(item => item.type === type)

  if (!intersectionType) {
    return (
      <Box sx={{ p: 3 }}>
        <BreadcrumbsNav />
        <Typography>Nenalezen platný typ křižovatky.</Typography>
      </Box>
    )
  }

  const handleSchemeSelect = (schemeId: string) => {
    setSelectedScheme(schemeId);
    navigate(`/select-variant/${type}/${schemeId}`)
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <BreadcrumbsNav />
      <Typography variant="h5" gutterBottom>
        Vyberte schéma křižovatky typu {type}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        {intersectionType.schemes.map(scheme => (
          <Button
            key={scheme.id}
            variant="outlined"
            onClick={() => handleSchemeSelect(scheme.id)}
            sx={{
              flexDirection: 'column',
              p: 2,
              width: 220,
              height: 250
            }}
          >
            <img
              src={`/imgs/${scheme.id}.jpg`}
              alt={scheme.name}
              style={{ width: '200px', height: 'auto' }}
            />
            <Typography variant="button" sx={{ mt: 1 }}>
              {scheme.name}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  )
}