/**
 * @file BreadcrumbsNav.tsx
 * @author Tomáš Barták
 * @description
 * Tato komponenta slouží k navigaci v hierarchii aplikace a zobrazení aktuální pozice.
 */
import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Breadcrumbs, Link, Typography, Box } from '@mui/material'
import { AppContext } from '../context/AppContext'

/**
 * Komponenta sloužící k navigaci v hierarchii aplikace a zobrazení aktuální pozice.
 */
export default function BreadcrumbsNav() {
  /**
   * Zvolené části hierarchie aplikace, dle kontextu.
   */
  const { selectedType, selectedScheme, selectedVariant } = useContext(AppContext)
  /**
   * Navigační funkce pro přechod mezi stránkami.
   */
  const navigate = useNavigate()
  /**
   * Aktuální umístění v hierarchii aplikace.
   */
  const location = useLocation()
  
  // Handler pro navigaci
  const handleNavigate = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    navigate(path)
  }

  /**
   * Funkce pro zjištění, zda je daná cesta aktivní. Podle toho je daná položka v navigaci zvýrazněna.
   * @param path Cesta k položce
   * @returns true, pokud je cesta aktivní
   */
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  /**
   * Funkce pro vytvoření položky v navigaci.
   * @param label Název položky
   * @param path Cesta k položce
   * @returns Položka navigace
   */
  const createBreadcrumb = (label: string, path: string) => {
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

  // Vytvoření pole pro položky breadcrumbs navigace
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
  
  /**
   * Vykreslení komponenty breadcrumbs navigace.
   */
  return (
    <Box sx={{ p: 1, mb: 2 }}>
      <Breadcrumbs separator="›">
        {breadcrumbs}
      </Breadcrumbs>
    </Box>
  );
}