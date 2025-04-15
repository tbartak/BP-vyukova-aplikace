/**
 * @file DetailPage.tsx
 * @author Tomáš Barták
 * @description
 * Tato stránka slouží k zobrazení detailů vybrané varianty křižovatky. Obsahuje vizualizaci grafu, seznam hran a navigaci mezi jednotlivými kroky.
 */
import { useContext, useState, useCallback } from 'react'
import { AppContext } from '../context/AppContext'
import Wizard from '../components/GraphWizard/Wizard'
import { Box, Typography } from '@mui/material'
import { Graph } from '../config/variants'
import IntersectionGraph from '../components/IntersectionGraph'
import BreadcrumbsNav from '../components/BreadcrumbsNav'
import EdgeList from '../components/EdgeList'

/**
 * Stránka zobrazující detail vybrané varianty křižovatky.
 */
export default function DetailPage() {
	/**
	 * Vybraná varianta křižovatky.
	 */
  const { selectedVariant } = useContext(AppContext)
	/**
	 * Aktuální stav grafu křižovatky.
	 */
  const [graph, setGraph] = useState<Graph>({ vertices: [], edges: [] })
	/**
	 * Zvýrazněná hrana grafu.
	 */
	const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

	/**
	 * Funkce pro zvýraznění hrany najetím myši.
	 */
	const handleEdgeHover = useCallback((edgeId: string | null) => {
		setHoveredEdgeId(edgeId);
	}, []);

	// Pokud není vybrána žádná varianta, zobrazí se zpráva o chybě
  if (!selectedVariant) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Nebyla vybrána žádná varianta.</Typography>
      </Box>
    )
  }

	/**
	 * Funkce, která přepočítá graf na základě vybraného kroku.
	 * @param stepIndex - Index aktuálního kroku
	 * @returns Aktualizovaný graf
	 */
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

	/**
	 * Funkce pro změnu kroku v grafu.
	 * @param stepIndex - Index aktuálního kroku
	 * @returns Aktualizovaný graf
	 */
  const handleStepChange = useCallback((stepIndex: number) => {
		if (stepIndex === 0) { // Pokud je krok 0, dojde k resetování grafu
			setGraph({ vertices: [], edges: [] })
			return
		}
    const newGraph = recalcGraph(stepIndex)
    setGraph(newGraph)
  }, [selectedVariant])

  return (
    <Box sx={{ p: 3 }}>
			<BreadcrumbsNav />
      <Typography variant="h4" gutterBottom>
        {selectedVariant.name}
      </Typography>
			<Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
				{/* Křižovatka */}
				<Box sx={{ width: '400px', textAlign: 'center' }}>
					<Typography variant="h6" gutterBottom>
						Zvolená varianta křižovatky:
					</Typography>
					<img
						src={`/imgs/${selectedVariant.id}.png`}
						alt="Zvolená varianta křižovatky"
						style={{ width: '400px' }}
					/>
				</Box>
				{/* Vizualizace společně se seznamem hran */}
				<Box sx={{ display: 'flex', flexDirection: 'row', gap: 0, width: '575px' }}>
					{/* Vizualizace grafu */}
					<Box sx={{ width: '400px', textAlign: 'center' }}>
						<Typography variant="h6" gutterBottom>
							Vizualizace grafu:
						</Typography>
						<IntersectionGraph 
							graph={graph}
							hoveredEdgeId={hoveredEdgeId}
							onEdgeHover={handleEdgeHover}	
						/>
					</Box>
					{/* Seznam hran */}
					<Box sx={{ width: '175px', textAlign: 'center' }}>
						<Typography variant="h6" gutterBottom>
							Seznam hran:
						</Typography>
						<EdgeList 
							graph={graph} 
							hoveredEdgeId={hoveredEdgeId}
							onEdgeHover={handleEdgeHover}
						/>
					</Box>
				</Box>
			</Box>
			{/* Wizard s kroky */}
			<Box sx={{
				width: '100%',
				maxWidth: '975px',
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