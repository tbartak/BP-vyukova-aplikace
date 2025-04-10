import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Breadcrumbs, Link, Typography, Box } from '@mui/material'
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

  // Pomocná funkce, která podle cesty zjišťuje, zda-li zvýraznit daný breadcrumb
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  // Vytvoření jednoho breadcrumbu
  const createBreadcrumb = (label, path) => {
    return isActive(path)
      ? <Typography key={label} color="text.primary">{label}</Typography>
      : <Link 
          key={label}
          underline="hover" 
          color="inherit"
          href={path}
          onClick={handleNavigate(path)}
        >
          {label}
        </Link>
  }

  const breadcrumbs = [];

  // Postupně dojde ke složení celé breadcrumbs navigace podle aktuální stránky a cesty
  breadcrumbs.push(createBreadcrumb('Domů', '/'))
  if (isActive('/tutorial')) {
    breadcrumbs.push(createBreadcrumb('Tutoriál', '/tutorial'))
  }
  else if (!isActive('/')) {
    breadcrumbs.push(createBreadcrumb('Výběr křižovatky', '/select-intersection'))
    if (selectedType) {
      breadcrumbs.push(createBreadcrumb(`Typ ${selectedType}`, `/select-scheme/${selectedType}`))
    }
    if (selectedScheme) {
      breadcrumbs.push(createBreadcrumb(`Schéma ${selectedScheme.split('-')[2]}`, `/select-variant/${selectedType}/${selectedScheme}`))
    }
    if (selectedVariant) {
      breadcrumbs.push(createBreadcrumb(selectedVariant.name, '/detail'))
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