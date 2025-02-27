import { useContext, useState, useCallback } from 'react'
import { AppContext } from '../context/AppContext'
import Wizard from '../components/GraphWizard/Wizard'
import { Box, Typography } from '@mui/material'
import { Graph } from '../config/variants'
import IntersectionGraph from '../components/IntersectionGraph'

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
      <Wizard
        steps={selectedVariant.steps}
        onStepChange={handleStepChange}
      />
			<Box sx={{ mt: 4, textAlign: 'left' }}>
				<Typography variant="h6">Aktuální graf:</Typography>
				<Typography>Vrcholy: {graph.vertices.map(vertex => vertex.id).join(', ')}</Typography>
				<Typography>
					Hrany:{' '}
					{graph.edges.map(edge => `${edge.source}-${edge.target}`).join(', ')}
				</Typography>
			</Box>
			<Box sx={{ mt: 4, textAlign: 'center' }}>
				<Typography variant="h6" gutterBottom>
					Vizualizace grafu:
				</Typography>
				<IntersectionGraph graph={graph} />
			</Box>
    </Box>
  )
}