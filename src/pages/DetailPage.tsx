import { useContext, useState, useCallback } from 'react'
import { AppContext } from '../context/AppContext'
import Wizard from '../components/GraphWizard/Wizard'
import { Box, Typography } from '@mui/material'
import { Graph } from '../config/variants'
import IntersectionGraph from '../components/IntersectionGraph'

// TODO: bylo by fajn, aby nahoře někde třeba vlevo nahoře v rohu byla nějaká navigace, například typ X > schéma 2 > varianta 3, aby zároveň bylo vidět, co si uživatel zvolil a zároveň, aby si mohl jednoduše zvolit úroveň, kde si chce vybrat nějakou jinou křižovatku
export default function DetailPage() {
  const { selectedVariant } = useContext(AppContext)
  const [graph, setGraph] = useState<Graph>({ vertices: [], edges: [] })

  if (!selectedVariant) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Nebyla vybrána žádná varianta.</Typography>
      </Box>
    )
  }

  // Funkce, která odpočítá graf od počátku až po daný krok.
  const recalcGraph = (stepIndex: number): Graph => {
    let newGraph: Graph = { vertices: [], edges: [] }
    for (let i = 0; i <= stepIndex; i++) {
      const step = selectedVariant.steps[i]
      if (step.action) {
        newGraph = step.action(newGraph)
      }
    }
    return newGraph
  }

  // Memoizovaná funkce, která při změně kroku přepočítá graf od počátku.
  const handleStepChange = useCallback((stepIndex: number) => {
    const newGraph = recalcGraph(stepIndex)
    setGraph(newGraph)
  }, [selectedVariant])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {selectedVariant.name}
      </Typography>
			<Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Zvolená varianta křižovatky:
        </Typography>
        <img
          src={`/imgs/${selectedVariant.id}.jpg`}
          alt="Zvolená varianta křižovatky"
          style={{ width: '300px' }}
        />
      </Box>
      <Wizard
        steps={selectedVariant.steps}
        onStepChange={handleStepChange}
      />
			<Box sx={{ mt: 4, textAlign: 'center' }}>
				<Typography variant="h6" gutterBottom>
					Vizualizace grafu:
				</Typography>
				<IntersectionGraph graph={graph} />
			</Box>
    </Box>
  )
}