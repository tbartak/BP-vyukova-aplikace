import { useParams, useNavigate } from 'react-router-dom'
import { intersectionConfig } from '../config/variants'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export default function VariantSelectPage() {
  const { type, schemeId } = useParams<{ type: 'T' | 'X'; schemeId: string }>()
  const navigate = useNavigate()
  const { setSelectedVariant } = useContext(AppContext)

  const intersectionType = intersectionConfig.find(item => item.type === type)
  if (!intersectionType) {
    return <div>Nenalezen platný typ křižovatky.</div>
  }
  const scheme = intersectionType.schemes.find(s => s.id === schemeId)
  if (!scheme) {
    return <div>Nenalezeno schéma křižovatky.</div>
  }

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant)
    navigate('/detail')
  }

  return (
    <div>
      <h2>Vyberte variantu pro {scheme.name}</h2>
      {scheme.variants.map(variant => (
        <div key={variant.id} style={{ marginBottom: '0.5rem' }}>
          <button onClick={() => handleVariantSelect(variant)}>
            {variant.name}
          </button>
        </div>
      ))}
    </div>
  )
}