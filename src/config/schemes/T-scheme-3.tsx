/**
 * @file T-scheme-3
 * @author Tomáš Barták
 * @description
 * Tento soubor obsahuje jednotlivé kroky pro všechny varianty schématu 3 křižovatky typu T.
 */
import { Step, Graph } from '../variants'
import { createSteps, getStepCounts } from '../scheme_utils'

// Definice ID variant
const variant1Id = 'T-scheme-3-var-1'
const variant2Id = 'T-scheme-3-var-2'
const variant3Id = 'T-scheme-3-var-3'
const variant4Id = 'T-scheme-3-var-4'

// Vrcholy jsou totožné pro všechny varianty T-scheme-3
/**
 * Vytvoření vrcholů grafu. Vrcholy jsou totožné pro všechny varianty T-scheme-3
 * @param graph Graf, do kterého se přidávají vrcholy
 * @returns Graf s přidanými vrcholy
 */
const createVertices = (graph: Graph): Graph => ({
  ...graph,
  vertices: [
    ...graph.vertices,
    { id: 'ES' },
    { id: 'EW' },
    { id: 'WS' },
    { id: 'SW' }
  ]
})

/**
 * Společné kroky pro všechny varianty T-scheme-3
 * @param variantId Identifikátor varianty
 * @returns Společné kroky pro dané schéma
 */
const createCommonSteps = (variantId: string): Step[] => {
	return createSteps(variantId, [
		{
			text: 'Úvod: Na schématu křižovatky typu T jsou zobrazeny 4 možné průjezdy: ES, EW, WS a SW. Tyto průjezdy budou tvořit vrcholy našeho grafu křižovatky.',
			noNumber: true
		},
		{
			text: 'Vytvoření všech vrcholů grafu (ES, EW, WS, SW).',
			action: createVertices
		},
		{
			text: 'Přidáme hranu mezi vrcholy ES a WS, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'ES', target: 'WS' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy ES a SW, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'ES', target: 'SW' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy EW a SW, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'EW', target: 'SW' }]
			})
		},
		{
			text: 'Ohodnotíme vrcholy podle intenzity provozu zvolené varianty.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v => {
					switch(v.id) {
						case 'ES': return { ...v, value: 0.7 } 
						case 'EW': return { ...v, value: 0.7 }
						case 'WS': return { ...v, value: 0.85 }
						case 'SW': return { ...v, value: 0.65 }
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
const commonStepsVar3 = createCommonSteps(variant3Id);
const commonStepsVar4 = createCommonSteps(variant4Id);

// Získání počtu kroků v společné části
const { totalSteps: var1TotalSteps, numberedSteps: var1NumberedSteps } = getStepCounts(commonStepsVar1);
const { totalSteps: var2TotalSteps, numberedSteps: var2NumberedSteps } = getStepCounts(commonStepsVar2);
const { totalSteps: var3TotalSteps, numberedSteps: var3NumberedSteps } = getStepCounts(commonStepsVar3);
const { totalSteps: var4TotalSteps, numberedSteps: var4NumberedSteps } = getStepCounts(commonStepsVar4);

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
					if (e.source === 'ES' && e.target === 'WS') return { ...e, value: 0.65 } // L/H 0,65
					if (e.source === 'ES' && e.target === 'SW') return { ...e, value: 0.55 } 
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.6 } // L/H 0,6
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
			text: 'Obarvíme vrchol SW červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol WS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'red' } : v
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
			text: 'Obarvíme vrchol ES zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {ES, EW}, S2 = {EW, WS}, S3 = {WS, SW}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou a pro S3 modrou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Ze simplexové metody vyšlo, že nezávislá množina S2 pro optimální řešení není potřebná. Obarvíme tedy vrchol, dle barev nezávislých množin, SW modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'cyan' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol WS pouze modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'cyan' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol EW červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol ES červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'red' } : v
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

// Varianta 2
export const variant2Steps: Step[] = [
  ...commonStepsVar2,
	...createSteps(variant2Id, [
		{
			text: 'Ohodnotíme hrany podle pravděpodobnosti kolize.',
			action: (graph: Graph) => {
				// Ohodnocení všech hran najednou pro názornost
				const edgesWithValues = graph.edges.map(e => {
					// Přiřazení hodnoty podle páru vrcholů
					if (e.source === 'ES' && e.target === 'WS') return { ...e, value: 0.65 } // L/H 0,65
					if (e.source === 'ES' && e.target === 'SW') return { ...e, value: 0.55 } 
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.2 } // L/H 0,6
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je slabě sousedící dvojice vrcholů, a to SW a EW.',
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
			text: 'Obarvíme vrchol SW červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol WS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol ES zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol EW barvou jeho sousedního vrcholu, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'red' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {ES}, S2 = {WS, SW}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou a pro S2 zelenou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, SW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol WS zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol ES červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Nakonec obarvíme vrchol EW barvou jeho sousedního vrcholu SW, zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní obarven. Frakcionální barvení neposkytuje efektivnější řešení než klasické barvení. Chromatické číslo tedy zůstává 2.',
			noNumber: true
		}
	], {
		startStepNum: var2TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
    startDisplayNum: var2NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Varianta 3
export const variant3Steps: Step[] = [
  ...commonStepsVar3,
	...createSteps(variant3Id, [
		{
			text: 'Ohodnotíme hrany podle pravděpodobnosti kolize.',
			action: (graph: Graph) => {
				// Ohodnocení všech hran najednou pro názornost
				const edgesWithValues = graph.edges.map(e => {
					// Přiřazení hodnoty podle páru vrcholů
					if (e.source === 'ES' && e.target === 'WS') return { ...e, value: 0.2 } // L/H 0,65
					if (e.source === 'ES' && e.target === 'SW') return { ...e, value: 0.55 } 
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.6 } // L/H 0,6
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je to slabě sousedící dvojice vrcholů, a to ES a WS.',
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
			text: 'Obarvíme vrchol SW červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'red' } : v
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
			text: 'Obarvíme vrchol ES zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol WS barvou jeho sousedního vrcholu ES, zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'yellowgreen' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {ES, EW}, S2 = {SW}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou a pro S2 zelenou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, SW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol EW červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol ES červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Nakonec obarvíme vrchol WS barvou jeho sousedního vrcholu ES, červeně.',
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
		startStepNum: var3TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
    startDisplayNum: var3NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Varianta 4
export const variant4Steps: Step[] = [
  ...commonStepsVar4,
	...createSteps(variant4Id, [
		{
			text: 'Ohodnotíme hrany podle pravděpodobnosti kolize.',
			action: (graph: Graph) => {
				// Ohodnocení všech hran najednou pro názornost
				const edgesWithValues = graph.edges.map(e => {
					// Přiřazení hodnoty podle páru vrcholů
					if (e.source === 'ES' && e.target === 'WS') return { ...e, value: 0.2 } // L/H 0,65
					if (e.source === 'ES' && e.target === 'SW') return { ...e, value: 0.55 } 
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.2 } // L/H 0,6
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě jsou to slabě sousedící dvojice vrcholů, a to ES a WS a také EW a SW.',
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
			text: 'Obarvíme vrchol SW červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol ES zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol WS barvou jeho sousedního vrcholu ES, zelenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol EW barvou jeho sousedního vrcholu SW, červenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'red' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {ES}, S2 = {SW}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou a pro S2 zelenou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, SW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol ES červenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Nakonec obarvíme vrchol WS barvou jeho sousedního vrcholu ES, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Podobně obarvíme vrchol EW barvou jeho sousedního vrcholu SW, zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní obarven. Frakcionální barvení neposkytuje efektivnější řešení než klasické barvení. Chromatické číslo tedy zůstává 2.',
			noNumber: true
		}
	], {
		startStepNum: var4TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
    startDisplayNum: var4NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Export všech variant pro použití v hlavním konfiguračním souboru 
export const T_scheme_3_variants = {
  [variant1Id]: variant1Steps,
	[variant2Id]: variant2Steps,
	[variant3Id]: variant3Steps,
	[variant4Id]: variant4Steps,
}