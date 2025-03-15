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

  // Zavoláme akci při každé změně kroku
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep) // TODO: nepřesunout sem samotný kód pro změnu kroku?
    }
  }, [currentStep, onStepChange])

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
    <Box sx={{ 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
      position: 'relative'
     }}>
      <Typography variant="h6" gutterBottom>
        {steps[currentStep].description}
      </Typography>
      <Box sx={{ 
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        p: 2
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