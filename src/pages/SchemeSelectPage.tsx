import { useParams, useNavigate } from 'react-router-dom'
import { intersectionConfig } from '../config/variants'

export default function SchemeSelectPage() {
  const { type } = useParams<{ type: 'T' | 'X' }>()
  const navigate = useNavigate()

  const intersectionType = intersectionConfig.find(item => item.type === type)

  if (!intersectionType) {
    return <div>Nenalezen platný typ křižovatky.</div>
  }

  const handleSchemeSelect = (schemeId: string) => {
    navigate(`/select-variant/${type}/${schemeId}`)
  }

  return (
    <div>
      <h2>Vyberte schéma křižovatky typu {type}</h2>
      {intersectionType.schemes.map(scheme => (
        <div key={scheme.id} style={{ marginBottom: '1rem' }}>
          <h3>{scheme.name}</h3>
          <button onClick={() => handleSchemeSelect(scheme.id)}>Vybrat</button>
        </div>
      ))}
    </div>
  )
}