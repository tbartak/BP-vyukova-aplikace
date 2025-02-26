import { useNavigate } from 'react-router-dom'

export default function IntersectionSelect() {
  const navigate = useNavigate()

  const handleTypeSelect = (type: 'T' | 'X') => {
    navigate(`/select-scheme/${type}`)
  }

  return (
    <div>
      <h2>Vyberte typ křižovatky</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => handleTypeSelect('T')}>
          <img
            src="/images/T-type.png" // nahraďte cestu ke skutečnému obrázku
            alt="Křižovatka typu T"
            style={{ width: '200px' }}
          />
          <div>Typ T</div>
        </button>
        <button onClick={() => handleTypeSelect('X')}>
          <img
            src="/images/X-type.png" // nahraďte cestu ke skutečnému obrázku
            alt="Křižovatka typu X"
            style={{ width: '200px' }}
          />
          <div>Typ X</div>
        </button>
      </div>
    </div>
  )
}