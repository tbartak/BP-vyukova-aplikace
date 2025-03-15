import { createContext, useState, ReactNode } from 'react'
import { Variant } from '../config/variants'

interface AppContextProps {
  selectedVariant: Variant | null
  setSelectedVariant: (variant: Variant) => void
  selectedType: 'T' | 'X' | null
  setSelectedType: (type: 'T' | 'X' | null) => void
  selectedScheme: string | null
  setSelectedScheme: (schemeId: string | null) => void
}

export const AppContext = createContext<AppContextProps>({
  selectedVariant: null,
  setSelectedVariant: () => {},
	selectedType: null,
	setSelectedType: () => {},
	selectedScheme: null,
	setSelectedScheme: () => {},
})

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