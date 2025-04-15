/**
 * @file T-scheme-5.tsx
 * @author Tomáš Barták
 * @description
 * Tento soubor obsahuje jednotlivé kroky pro všechny varianty schématu 5 křižovatky typu T.
 */
import { Step, Graph } from '../variants'
import { createSteps, getStepCounts } from '../scheme_utils'

// Definice ID variant
const variant1Id = 'T-scheme-5-var-1'
const variant2Id = 'T-scheme-5-var-2'

/**
 * Vytvoření vrcholů grafu. Vrcholy jsou totožné pro všechny varianty T-scheme-5.
 * @param graph Graf, do kterého se přidávají vrcholy
 * @returns Graf s přidanými vrcholy
 */
const createVertices = (graph: Graph): Graph => ({
  ...graph,
  vertices: [
    ...graph.vertices,
    { id: 'EW' },
    { id: 'SE' },
    { id: 'WE' },
    { id: 'WS' }
  ]
})

/**
 * Společné kroky pro všechny varianty T-scheme-5
 * @param variantId Identifikátor varianty
 * @returns Společné kroky pro dané schéma
 */
const createCommonSteps = (variantId: string): Step[] => {
	return createSteps(variantId, [
		{
			text: 'Úvod: Na schématu křižovatky typu T jsou zobrazeny 4 možné průjezdy: EW, SE, WE a WS. Tyto průjezdy budou tvořit vrcholy našeho grafu křižovatky.',
			noNumber: true
		},
		{
			text: 'Vytvoření všech vrcholů grafu (EW, SE, WE, WS).',
			action: createVertices
		},
		{
			text: 'Přidáme hranu mezi vrcholy SE a WE, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'SE', target: 'WE' }]
			})
		},
		{
			text: 'Ohodnotíme vrcholy podle intenzity provozu zvolené varianty.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v => {
					switch(v.id) {
						case 'EW': return { ...v, value: 0.9 } 
						case 'SE': return { ...v, value: 0.7 }
						case 'WE': return { ...v, value: 0.85 }
						case 'WS': return { ...v, value: 0.65 }
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
					// Přiřazení hodnoty podle páru vrcholů
					if (e.source === 'SE' && e.target === 'WE') return { ...e, value: 0.7 } // L/H 0,7
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{
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
			text: 'Obarvíme vrchol WE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SE zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SE' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Nakonec obarvíme vrchol EW, který není hranou spojený s žádným dalším vrcholem, zvolíme pro něj tedy libovolnou barvu, například červenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Podobně obarvíme vrchol WS, který není hranou spojený s žádným dalším vrcholem, zvolíme pro něj tedy také libovolnou barvu, například opět červenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Graf je nyní kompletně obarven a má chromatické číslo 2.',
			noNumber: true,
			action: (graph: Graph) => {
				return graph;
			}
		},
		{
			text: 'Dále graf zkusíme obarvit ještě frakcionálně, což může pomoct nalézt optimálnější řešení nastavení křižovatky.',
			noNumber: true,
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {SE}, S2 = {WE}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou a pro S2 zelenou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WE zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol SE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SE' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Nakonec obarvíme vrchol EW, který není hranou spojený s žádným vrcholem, můžeme ho tedy obarvit libovolnou barvou, například červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Podobně obarvíme vrchol WS, který není hranou spojený s žádným vrcholem, můžeme ho tedy obarvit libovolnou barvou, například také červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní obarven. Frakcionální barvení neposkytuje efektivnější řešení než klasické barvení. Chromatické číslo tedy zůstává 2.', 
			noNumber: true
		}
	], {
		startStepNum: var1TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
    startDisplayNum: var1NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Varianta 1
export const variant2Steps: Step[] = [
  ...commonStepsVar2,
	...createSteps(variant2Id, [
		{
			text: 'Ohodnotíme hrany podle pravděpodobnosti kolize.',
			action: (graph: Graph) => {
				// Ohodnocení všech hran najednou pro názornost
				const edgesWithValues = graph.edges.map(e => {
					// Přiřazení hodnoty podle páru vrcholů
					if (e.source === 'SE' && e.target === 'WE') return { ...e, value: 0.3 } // L/H 0,7
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je to dvojice slabě sousedících vrcholů, a to SE a WE.',
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
			text: 'Obarvíme vrchol WE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SE barvou jeho sousedního vrcholu WE, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SE' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Nakonec obarvíme vrchol EW, který není hranou spojený s žádným dalším vrcholem, zvolíme pro něj tedy libovolnou barvu, například červenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Podobně obarvíme vrchol WS, který není hranou spojený s žádným dalším vrcholem, zvolíme pro něj tedy také libovolnou barvu, například opět červenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Graf je nyní kompletně obarven a má chromatické číslo 1.',
			noNumber: true,
			action: (graph: Graph) => {
				return graph;
			}
		},
		{
			text: 'Tento graf není potřeba dále zkoušet barvit frakcionálně, nižší chromatické číslo než 1 nelze nalézt.',
			noNumber: true,
		}
	], {
		startStepNum: var2TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
    startDisplayNum: var2NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Export všech variant pro použití v hlavním konfiguračním souboru 
export const T_scheme_5_variants = {
  [variant1Id]: variant1Steps,
	[variant2Id]: variant2Steps,
}