import { useContext, useState, useCallback } from 'react'
import { AppContext } from '../context/AppContext'
import Wizard from '../components/GraphWizard/Wizard'
import { Box, Typography } from '@mui/material'
import { Graph } from '../config/variants'
import IntersectionGraph from '../components/IntersectionGraph'
import BreadcrumbsNav from '../components/BreadcrumbsNav'

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

  // Funkce, která přepočítá graf
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

  // Memoizovaná funkce, která při změně kroku přepočítá graf
  const handleStepChange = useCallback((stepIndex: number) => {
    const newGraph = recalcGraph(stepIndex)
    setGraph(newGraph)
  }, [selectedVariant])

  return (
    <Box sx={{ p: 3 }}>
			<BreadcrumbsNav />
      <Typography variant="h4" gutterBottom>
        {selectedVariant.name}
      </Typography>
			<Box sx={{ flexDirection: 'row', display: 'flex', gap: 4, textAlign: 'center', mt: 4 }}>
				<Box sx={{ flex: 1 }}>
					<Typography variant="h6" gutterBottom>
						Zvolená varianta křižovatky:
					</Typography>
					<img
						src={`/imgs/${selectedVariant.id}.jpg`}
						alt="Zvolená varianta křižovatky"
						style={{ width: '400px' }}
					/>
				</Box>
				<Box sx={{ flex: 1, textAlign: 'center' }}>
					<Typography variant="h6" gutterBottom>
						Vizualizace grafu:
					</Typography>
					<IntersectionGraph graph={graph} />
				</Box>
			</Box>
			<Box sx={{
				width: '100%',
				maxWidth: '830px',
				mx: 'auto',
				mt: 2
			}}>
				<Wizard
					steps={selectedVariant.steps}
					onStepChange={handleStepChange}
				/>
			</Box>
    </Box>
  )
}