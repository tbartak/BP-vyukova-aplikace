import { createContext, useState, ReactNode } from 'react'
import { Variant } from '../config/variants'

interface AppContextProps {
  selectedVariant: Variant | null
  setSelectedVariant: (variant: Variant) => void
}

export const AppContext = createContext<AppContextProps>({
  selectedVariant: null,
  setSelectedVariant: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)

  return (
    <AppContext.Provider value={{ selectedVariant, setSelectedVariant }}>
      {children}
    </AppContext.Provider>
  )
}