/**
 * @file AppContext.tsx
 * @author Tomáš Barták
 * @description
 * Tento soubor obsahuje kontext aplikace, který slouží k předávání dat mezi komponentami. Obsahuje informace o vybrané variantě, typu a schématu.
 */
import { createContext, useState, ReactNode } from 'react'
import { Variant } from '../config/variants'

/**
 * Rozhraní pro kontext aplikace.
 * @interface AppContextProps
 * @property {'T' | 'X' | null} selectedType - Vybraný typ (T nebo X).
 * @property {Function} setSelectedType - Funkce pro nastavení vybraného typu.
 * @property {string | null} selectedScheme - Vybrané schéma.
 * @property {Function} setSelectedScheme - Funkce pro nastavení vybraného schématu.
 * @property {Variant | null} selectedVariant - Vybraná varianta.
 * @property {Function} setSelectedVariant - Funkce pro nastavení vybrané varianty.
 */
interface AppContextProps {
  selectedType: 'T' | 'X' | null
  setSelectedType: (type: 'T' | 'X' | null) => void
  selectedScheme: string | null
  setSelectedScheme: (schemeId: string | null) => void
	selectedVariant: Variant | null
  setSelectedVariant: (variant: Variant | null) => void
}

/**
 * Vytvoření kontextu aplikace s výchozími hodnotami.
 */
export const AppContext = createContext<AppContextProps>({
  selectedVariant: null,
  setSelectedVariant: () => {},
	selectedType: null,
	setSelectedType: () => {},
	selectedScheme: null,
	setSelectedScheme: () => {},
})
/**
 * Komponenta poskytující kontext aplikace.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
	const [selectedType, setSelectedType] = useState<'T' | 'X' | null>(null)
	const [selectedScheme, setSelectedScheme] = useState<string | null>(null)

  return (
    <AppContext.Provider value={{ selectedVariant, setSelectedVariant, selectedType, setSelectedType, selectedScheme, setSelectedScheme }}>
      {children}
    </AppContext.Provider>
  )
}