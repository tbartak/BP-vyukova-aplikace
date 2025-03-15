import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Breadcrumbs, Link, Typography, Box } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { AppContext } from '../context/AppContext'

// TODO: přidat kdyžtak breadcrumbs včetně úpravy kontextu do BP dokumentace
export default function BreadcrumbsNav() {
  const { selectedType, selectedScheme, selectedVariant } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Handler pro navigaci
  const handleNavigate = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    navigate(path)
  }

  // Pro určení aktuální stránky, bude zvýrazněná černě a nepůjde rozkliknout
  const isHomePage = location.pathname === '/'
  const isTutorial = location.pathname === '/tutorial'
  const isIntersectionSelect = location.pathname === '/select-intersection'
  const isSchemeSelect = location.pathname.startsWith('/select-scheme/')
  const isVariantSelect = location.pathname.startsWith('/select-variant/')
  const isDetail = location.pathname === '/detail'

  // Prepare the breadcrumbs array based on the current page and selections
  const breadcrumbs = [];
  
  // Home is always the first item
  breadcrumbs.push(
    isHomePage 
      ? <Typography key="home" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Domů
        </Typography>
      : <Link 
          key="home"
          underline="hover" 
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
          onClick={handleNavigate('/')}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Domů
        </Link>
  );
  
  // If we're on the tutorial page, just add Tutorial
  if (isTutorial) {
    breadcrumbs.push(
      <Typography key="tutorial" color="text.primary">Tutoriál</Typography>
    );
  } 
  // Otherwise, build the navigation path based on user selection
  else if (!isHomePage) {
    // Add Intersection Select
    breadcrumbs.push(
      isIntersectionSelect 
        ? <Typography key="intersection" color="text.primary">Výběr křižovatky</Typography> 
        : <Link 
            key="intersection"
            underline="hover" 
            color="inherit"
            href="/select-intersection"
            onClick={handleNavigate('/select-intersection')}
          >
            Výběr křižovatky
          </Link>
    );
    
    // Add Type if selected
    if (selectedType) {
      breadcrumbs.push(
        isSchemeSelect 
          ? <Typography key="type" color="text.primary">Typ {selectedType}</Typography>
          : <Link 
              key="type"
              underline="hover" 
              color="inherit"
              href={`/select-scheme/${selectedType}`}
              onClick={handleNavigate(`/select-scheme/${selectedType}`)}
            >
              Typ {selectedType}
            </Link>
      );
    }
    
    // Add Scheme if selected
    if (selectedScheme) {
      const schemeName = selectedScheme.includes('scheme') 
        ? `Schéma ${selectedScheme.split('-')[2]}` 
        : selectedScheme;
        
      breadcrumbs.push(
        isVariantSelect 
          ? <Typography key="scheme" color="text.primary">{schemeName}</Typography>
          : <Link 
              key="scheme"
              underline="hover" 
              color="inherit"
              href={`/select-variant/${selectedType}/${selectedScheme}`}
              onClick={handleNavigate(`/select-variant/${selectedType}/${selectedScheme}`)}
            >
              {schemeName}
            </Link>
      );
    }
    
    // Add Variant if selected
    if (selectedVariant) {
      breadcrumbs.push(
        <Typography key="variant" color="text.primary">{selectedVariant.name}</Typography>
      );
    }
  }
  
  return (
    <Box sx={{ p: 1, mb: 2 }}>
      <Breadcrumbs separator="›">
        {breadcrumbs}
      </Breadcrumbs>
    </Box>
  );
}