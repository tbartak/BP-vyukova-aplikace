import { useState, useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import Wizard from '../components/GraphWizard/Wizard'
import IntersectionGraph from '../components/IntersectionGraph'
import { Graph, Step } from '../config/variants'

const tutorialSteps: Step[] = [
  {
    id: 'tut-1',
    description: 'Úvod: Představení tutoriálu a základních pojmů.',
  },
  {
    id: 'tut-2',
    description: 'Krok 1: Přidání vrcholu A do grafu.',
    action: (graph: Graph) => ({ ...graph, vertices: [...graph.vertices, 'A'] }),
  },
  {
    id: 'tut-3',
    description: 'Krok 2: Přidání vrcholu B do grafu.',
    action: (graph: Graph) => ({ ...graph, vertices: [...graph.vertices, 'B'] }),
  },
  {
    id: 'tut-4',
    description: 'Krok 3: Spojení vrcholů A a B hranou.',
    action: (graph: Graph) => ({ ...graph, edges: [...graph.edges, ['A', 'B']] }),
  },
]

export default function TutorialPage() {
  const [graph, setGraph] = useState<Graph>({ vertices: [], edges: [] })

  const handleStepChange = useCallback((stepIndex: number) => {
    // Znovuvytvoříme graf od začátku až do aktuálního kroku
    let newGraph: Graph = { vertices: [], edges: [] }
    for (let i = 0; i <= stepIndex; i++) {
      const step = tutorialSteps[i]
      if (step.action) {
        newGraph = step.action(newGraph)
      }
    }
    setGraph(newGraph)
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tutoriál
      </Typography>
      <Typography variant="body1" gutterBottom>
        Tento tutoriál vás provede tvorbou grafu na základě schématu křižovatky. V pravé části můžete sledovat aktuální podobu grafu.
      </Typography>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Původní schéma křižovatky:
        </Typography>
        <img
          src="src/imgs/tutorial_scheme.jpg"
          alt="Původní schéma křižovatky"
          style={{ width: '300px' }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Wizard steps={tutorialSteps} onStepChange={handleStepChange} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 300, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Vizualizace grafu
          </Typography>
          <IntersectionGraph graph={graph} />
        </Box>
      </Box>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Příklady schémat křižovatky:
        </Typography>
        <img
          src="src/imgs/T-type.jpg" // TODO: mohlo by být jako tlačítko, které by přesměrovalo uživatele na dané schéma
          alt="Schéma křižovatky typu T"
          style={{ width: '200px', marginRight: '10px' }}
        />
        <img
          src="src/imgs/X-type.jpg" // TODO: mohlo by být jako tlačítko, které by přesměrovalo uživatele na dané schéma
          alt="Schéma křižovatky typu X"
          style={{ width: '200px' }}
        />
      </Box>
    </Box>
  )
}