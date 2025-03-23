import { useEffect, useState } from 'react'
import { Step } from '../../config/variants'
import { Box, Button, Typography } from '@mui/material'

interface WizardProps {
  steps: Step[]
  // Callback, který se zavolá při změně kroku
  onStepChange?: (stepIndex: number) => void
}

export default function Wizard({ steps, onStepChange }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isDescriptionPhase, setIsDescriptionPhase] = useState(true) // Fáze popisu, aby bylo možné kroky, které mají zároveň popis i akci na "dva" kroky

  // Zavoláme akci při každé změně kroku
  useEffect(() => {
    if (onStepChange && !isDescriptionPhase) {
      onStepChange(currentStep)
    }
  }, [currentStep, onStepChange, isDescriptionPhase])

  const goNext = () => {
    if (isDescriptionPhase && steps[currentStep].action) { // Pokud má daný krok i akci, tak ji provedeme
      setIsDescriptionPhase(false)
    } else { // Další krok
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        setIsDescriptionPhase(true) // Popis je vždy jako první u daného kroku
      }
    }
  }

  const goPrev = () => {
    if (!isDescriptionPhase) { // Pokud jsme v akci, tak se vrátíme zpět na popis
      setIsDescriptionPhase(true)
    } else {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1)
        const hasAction = steps[currentStep - 1].action !== undefined 
        setIsDescriptionPhase(!hasAction) // Vrácení na předchozí krok, podle toho jestli má akci nebo pouze popis
      }
    }
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '205px',
     }}>
      <Typography variant="h6" gutterBottom>
        {steps[currentStep].description}
      </Typography>
      <Box sx={{ 
        mt: 'auto',
        display: 'flex',
        justifyContent: 'center',
        gap: 2
      }}>
        {currentStep > 0 && (
          <Button variant="contained" onClick={goPrev}>
            Předchozí
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button variant="contained" onClick={goNext}>
            Další
          </Button>
        )}
      </Box>
    </Box>
  )
}