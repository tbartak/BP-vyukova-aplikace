import { Step, Graph } from '../variants'
import { createSteps, getStepCounts } from '../scheme_utils'

// Definice ID variant
const variant1Id = 'X-scheme-1-var-1'
const variant2Id = 'X-scheme-1-var-2'

// Vrcholy jsou totožné pro všechny varianty X-scheme-1
const createVertices = (graph: Graph): Graph => ({
  ...graph,
  vertices: [
    ...graph.vertices,
    { id: 'NE' },
    { id: 'EW' },
    { id: 'NS' },
    { id: 'SN' },
    { id: 'WE' }
  ]
})

// Společné kroky pro všechny varianty X-scheme-1
const createCommonSteps = (variantId: string): Step[] => {
	return createSteps(variantId, [
		{
			text: 'Úvod: Na schématu křižovatky typu X je zobrazeno 5 možných průjezdů: NE, EW, WE, NS a SN. Tyto průjezdy budou tvořit vrcholy našeho grafu křižovatky.',
			noNumber: true
		},
		{
			text: 'Vytvoření všech vrcholů grafu (NE, EW, WE, NS, SN).',
			action: createVertices
		},
		{
			text: 'Přidáme hranu mezi vrcholy NE a EW, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NE', target: 'EW' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy NE a WE, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NE', target: 'WE' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy NE a SN, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NE', target: 'SN' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy SN a EW, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'SN', target: 'EW' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy SN a WE, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'SN', target: 'WE' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy WE a NS, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'WE', target: 'NS' }]
			})
		},
		{
			text: 'Nakonec přidáme hranu mezi vrcholy EW a NS, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'EW', target: 'NS' }]
			})
		},
		{
			text: 'Ohodnotíme vrcholy podle intenzity provozu zvolené varianty.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v => {
					switch(v.id) {
						case 'NE': return { ...v, value: 0.5 }        
						case 'EW': return { ...v, value: 0.6 }
						case 'NS': return { ...v, value: 0.8 }
						case 'SN': return { ...v, value: 0.7 }
						case 'WE': return { ...v, value: 0.7 }
						default: return v
					}
				})
				return { ...graph, vertices: newVertices }
			}
		}
	]);
};

// Vytvoření společných kroků
const commonStepsVar1 = createCommonSteps(variant1Id);
const commonStepsVar2 = createCommonSteps(variant2Id);

// Získání počtu kroků v společné části
const { totalSteps: var1TotalSteps, numberedSteps: var1NumberedSteps } = getStepCounts(commonStepsVar1);
const { totalSteps: var2TotalSteps, numberedSteps: var2NumberedSteps } = getStepCounts(commonStepsVar2);

// Varianta 1
export const variant1Steps: Step[] = [
	...commonStepsVar1,
  ...createSteps(variant1Id, [
		{
			text: 'Ohodnotíme hrany podle pravděpodobnosti kolize.',
			action: (graph: Graph) => {
				// Ohodnocení všech hran najednou pro názornost
				const edgesWithValues = graph.edges.map(e => {
					// Přiřadíme hodnoty podle páru vrcholů
					if (e.source === 'NE' && e.target === 'EW') return { ...e, value: 0.45 }
					if (e.source === 'NE' && e.target === 'WE') return { ...e, value: 0.4 }
					if (e.source === 'NE' && e.target === 'SN') return { ...e, value: 0.5 }
					if (e.source === 'SN' && e.target === 'EW') return { ...e, value: 0.55 }
					if (e.source === 'SN' && e.target === 'WE') return { ...e, value: 0.6 }
					if (e.source === 'WE' && e.target === 'NS') return { ...e, value: 0.65 }
					if (e.source === 'EW' && e.target === 'NS') return { ...e, value: 0.6 }
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), nicméně v této variantě žádné slabě sousedící vrcholy či hrany neexistují.',
			action: (graph: Graph) => {
				const edgesWithType = graph.edges.map(e => {
					const sourceVertex = graph.vertices.find(v => v.id === e.source);
					const targetVertex = graph.vertices.find(v => v.id === e.target);
					
					if (sourceVertex?.value && targetVertex?.value) {
						const minVertexValue = Math.min(sourceVertex.value, targetVertex.value);
						if (e.value && e.value < minVertexValue / 2) {
							return { ...e, type: 'weak' as const };
						}
					}
					return { ...e, type: 'strong' as const };
				});
				
				return { ...graph, edges: edgesWithType };
			}
		},
		{
			text: 'Dále je možné graf začít barvit jako u klasických grafů.',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol NE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol EW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SN modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol WE zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Graf je nyní kompletně obarven a má chromatické číslo 3.',
			noNumber: true,
			action: (graph: Graph) => {
				return graph;
			}
		},
		{
			text: 'Dále graf zkusíme obarvit ještě frakcionálně, což může pomoct nalézt optimálnější řešení nastavení křižovatky.',
			noNumber: true
		},
		{
			text: 'Reset barev: Vrátíme se do stavu před barvením a aplikujeme frakcionální barvení.',
			noNumber: true,
			action: (graph: Graph) => {
				// Reset barev všech vrcholů
				const resetVertices = graph.vertices.map(v => {
					const { color, ...rest } = v;
					return rest;
				});
				return { ...graph, vertices: resetVertices };
			}
		},
		{
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NE, NS}, S2 = {EW, WE}, S3 = {SN, NS}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou a pro S3 modrou.',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, NE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol EW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol SN modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'cyan' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol WE zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Frakcionálně obarvíme vrchol NS - z poloviny červenou barvou a z poloviny modrou barvou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: { type: 'fractional', colors: ['red', 'cyan'] } } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní frakcionálně obarven. Vrchol NS je z poloviny červený a z poloviny modrý, což znamená, že využívá dvě různé barvy s vahou 0.5 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.',
			noNumber: true
		}
	], {
		startStepNum: var1TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
    startDisplayNum: var1NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Varianta 2
export const variant2Steps: Step[] = [
	...commonStepsVar2,
  ...createSteps(variant2Id, [
		{
			text: 'Ohodnotíme hrany podle pravděpodobnosti kolize.',
			action: (graph: Graph) => {
				// Ohodnocení všech hran najednou pro názornost
				const edgesWithValues = graph.edges.map(e => {
					// Přiřadíme hodnoty podle páru vrcholů
					if (e.source === 'NE' && e.target === 'EW') return { ...e, value: 0.45 }
					if (e.source === 'NE' && e.target === 'WE') return { ...e, value: 0.2 }
					if (e.source === 'NE' && e.target === 'SN') return { ...e, value: 0.5 }
					if (e.source === 'SN' && e.target === 'EW') return { ...e, value: 0.55 }
					if (e.source === 'SN' && e.target === 'WE') return { ...e, value: 0.6 }
					if (e.source === 'WE' && e.target === 'NS') return { ...e, value: 0.65 }
					if (e.source === 'EW' && e.target === 'NS') return { ...e, value: 0.6 }
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je jedna slabá hrana, a to mezi vrcholy WE a NE.',
			action: (graph: Graph) => {
				const edgesWithType = graph.edges.map(e => {
					const sourceVertex = graph.vertices.find(v => v.id === e.source);
					const targetVertex = graph.vertices.find(v => v.id === e.target);
					
					if (sourceVertex?.value && targetVertex?.value) {
						const minVertexValue = Math.min(sourceVertex.value, targetVertex.value);
						if (e.value && e.value < minVertexValue / 2) {
							return { ...e, type: 'weak' as const }; // TODO: možná rovnou pak odstranit nebo něco
						}
					}
					return { ...e, type: 'strong' as const };
				});
				
				return { ...graph, edges: edgesWithType };
			}
		},
		{
			text: 'Dále je možné graf začít barvit jako u klasických grafů.',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol NE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol EW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SN modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol WE zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Graf je nyní kompletně obarven a má chromatické číslo 3.',
			noNumber: true,
			action: (graph: Graph) => {
				return graph;
			}
		},
		{
			text: 'Dále graf zkusíme obarvit ještě frakcionálně, což může pomoct nalézt optimálnější řešení nastavení křižovatky.',
			noNumber: true
		},
		{
			text: 'Reset barev: Vrátíme se do stavu před barvením a aplikujeme frakcionální barvení.',
			noNumber: true,
			action: (graph: Graph) => {
				// Reset barev všech vrcholů
				const resetVertices = graph.vertices.map(v => {
					const { color, ...rest } = v;
					return rest;
				});
				return { ...graph, vertices: resetVertices };
			}
		},
		{
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NE, NS}, S2 = {EW, WE}, S3 = {SN, NS}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou a pro S3 modrou.',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, NE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol EW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol SN modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'cyan' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol WE zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Frakcionálně obarvíme vrchol NS - z poloviny červenou barvou a z poloviny modrou barvou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: { type: 'fractional', colors: ['red', 'cyan'] } } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní frakcionálně obarven. Vrchol NS je z poloviny červený a z poloviny modrý, což znamená, že využívá dvě různé barvy s vahou 0.5 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.',
			noNumber: true
		}
	], {
		startStepNum: var2TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
		startDisplayNum: var2NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Export všech variant pro použití v hlavním konfiguračním souboru
export const X_scheme_1_variants = {
  [variant1Id]: variant1Steps,
  [variant2Id]: variant2Steps,
}