/**
 * @file Wizard.tsx
 * @author Tomáš Barták
 * @description 
 * Tato komponenta slouží jako vícekrokový průvodce, který umožňuje uživateli procházet tuto posloupnost kroků a postupně sledovat ransformaci grafu s jejím popisem.
 */
import { useEffect, useState } from 'react'
import { Step } from '../../config/variants'
import { Box, Button, Typography } from '@mui/material'

/**
 * Rozhraní průvodce s danými parametry
 * @interface WizardProps
 * @property {Step[]} steps - pole kroků, které se mají zobrazit
 * @property {Function} onStepChange - funkce, která se zavolá při změně kroku
 */
interface WizardProps {
  steps: Step[]
  onStepChange?: (stepIndex: number) => void
}

/**
 * Komponenta sloužící jako vícekrokový průvodce převodu schématu křižovatky na graf s jeho následným obarvením. Poskytuje obousměrnou navigaci mezi jednotlivými kroky včetně popisu a změn vizualizace grafu.
 * @param {WizardProps} props - vlastnosti komponenty
 * @returns {JSX.Element} - render komponenty průvodce
 */
export default function Wizard({ steps, onStepChange }: WizardProps) {
  /**
   * Stav aktuálního kroku (index)
   */
  const [currentStep, setCurrentStep] = useState(0)
  /**
   * Stav určující zda je aktuálně zobrazena část popisu kroku, aby bylo možné "rozdělit" kroky, které mají zároveň popis i akci na "dva" kroky (popis a akci)
   */
  const [isDescriptionPhase, setIsDescriptionPhase] = useState(true)

  /**
   * Efekt, který se spustí při změně aktuálního kroku. Pokud je zobrazena část akce, zavolá se funkce onStepChange s aktuálním krokem. Odstranění grafu, pokud se uživatel vrátí na první krok.
   */
  useEffect(() => {
    if (onStepChange) {
      if (!isDescriptionPhase) {
        // Akční fáze, vytvoření grafu až po aktuální krok
        onStepChange(currentStep)
      } else if (currentStep === 0) {
        // První krok, graf by měl být obnoven do původní formy
        onStepChange(currentStep)
      }
    }
  }, [currentStep, onStepChange, isDescriptionPhase])

  /**
   * Funkce pro navigaci na následující krok, případně přechod mezi popisnou a akční částí kroku.
   */
  const goNext = () => {
    if (isDescriptionPhase && steps[currentStep].action) { // Pokud má daný krok i akci, pak se provede
      setIsDescriptionPhase(false)
    } else { // Další krok
      if (currentStep < steps.length - 1) { // Pokud aktuální krok není poslední
        setCurrentStep(currentStep + 1)
        setIsDescriptionPhase(true) // Popis je vždy jako první u daného kroku
      }
    }
  }

  /**
   * Funkce pro navigaci na předchozí krok, případně přechod mezi popisnou a akční částí kroku.
   */
  const goPrev = () => {
    if (!isDescriptionPhase) { // Pokud je aktuálně zobrazena akce, tak se přechází zpět na popis
      setIsDescriptionPhase(true)
    } else {
      if (currentStep > 0) { // Pokud aktuální krok není první
        setCurrentStep(currentStep - 1)
        const hasAction = steps[currentStep - 1].action !== undefined 
        setIsDescriptionPhase(!hasAction) // Vrácení na předchozí krok, podle toho, zda má akci nebo pouze popis
      }
    }
  }

  /**
   * Umožnění uživateli ovládat průvodce pomocí klávesových šipek (vpravo/nahoru - dopředu, vlevo/dolů - dozadu).
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Odstranění výchozího chování šipek
      if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
      }

      // Navigace pomocí šipek
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          if (currentStep < steps.length - 1) {
            goNext();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          if (currentStep > 0) {
            goPrev();
          }
          break;
        default:
          break;
      }
    };

    // Přidání event listeneru pro stisk klávesy
    window.addEventListener('keydown', handleKeyDown);

    // Odstranění event listeneru, když se komponenta přestane používat, aby nedocházelo k duplicitám a dalším nezamýšleným chováním
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, isDescriptionPhase, steps]);

  /**
   * Vykreslení komponenty průvodce s popisem kroků a navigačními tlačítky s dynamickým obsahem podle následující fáze kroku
   */
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
            {isDescriptionPhase && steps[currentStep].action ? "Provést akci" : "Další"}
          </Button>
        )}
      </Box>
    </Box>
  )
}