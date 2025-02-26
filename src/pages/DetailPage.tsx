import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Wizard from '../components/GraphWizard/Wizard'

export default function DetailPage() {
  const { selectedVariant } = useContext(AppContext)

  if (!selectedVariant) {
    return <div>Nebyla vybrána žádná varianta.</div>
  }

  return (
    <div>
      <h1>{selectedVariant.name}</h1>
      <Wizard steps={selectedVariant.steps} />
    </div>
  )
}