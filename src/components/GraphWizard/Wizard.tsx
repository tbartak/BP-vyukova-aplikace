import { useState } from 'react'
import { Step } from '../../config/variants'
import { Box, Button, Typography } from '@mui/material'

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {steps[currentStep].description}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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