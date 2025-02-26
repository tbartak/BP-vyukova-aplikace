import { useState } from 'react'
import { Step } from '../../config/variants'

interface WizardProps {
  steps: Step[]
}

export default function Wizard({ steps }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div>
      <div>
        <h3>{steps[currentStep].description}</h3>
      </div>
      <div>
        {currentStep > 0 && <button onClick={goPrev}>Předchozí</button>}
        {currentStep < steps.length - 1 && (
          <button onClick={goNext}>Další</button>
        )}
      </div>
    </div>
  )
}