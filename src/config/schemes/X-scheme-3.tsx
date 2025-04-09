import { Step, Graph } from '../variants'
import { createSteps, getStepCounts } from '../scheme_utils'

// Definice ID variant
const variant1Id = 'X-scheme-3-var-1'
const variant2Id = 'X-scheme-3-var-2'
const variant3Id = 'X-scheme-3-var-3'
const variant4Id = 'X-scheme-3-var-4'

// Vrcholy jsou totožné pro všechny varianty X-scheme-3
const createVertices = (graph: Graph): Graph => ({
  ...graph,
  vertices: [
    ...graph.vertices,
    { id: 'NE' },
    { id: 'ES' },
    { id: 'SN' },
    { id: 'WE' },
    { id: 'WS' }
  ]
})

// Společné kroky pro všechny varianty X-scheme-3
const createCommonSteps = (variantId: string): Step[] => {
	return createSteps(variantId, [
		{
			text: 'Úvod: Na schématu křižovatky typu X je zobrazeno 5 možných průjezdů: NE, ES, SN, WE a WS. Tyto průjezdy budou tvořit vrcholy našeho grafu křižovatky.',
			noNumber: true
		},
		{
			text: 'Vytvoření všech vrcholů grafu (NE, ES, SN, WE, WS).',
			action: createVertices
		},
		{
			text: 'Přidáme hranu mezi vrcholy NE a ES, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NE', target: 'ES' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy NE a SN, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NE', target: 'SN' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy NE a WE, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NE', target: 'WE' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy ES a SN, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'ES', target: 'SN' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy ES a WE, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'ES', target: 'WE' }]
			})
		},
        {
			text: 'Přidáme hranu mezi vrcholy ES a WS, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'ES', target: 'WS' }]
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
			text: 'Ohodnotíme vrcholy podle intenzity provozu zvolené varianty.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v => {
					switch(v.id) {
						case 'NE': return { ...v, value: 0.6 } 
						case 'ES': return { ...v, value: 0.5 }       
						case 'SN': return { ...v, value: 0.7 }
						case 'WE': return { ...v, value: 0.4 }
						case 'WS': return { ...v, value: 0.6 }
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
					// Přiřadíme hodnoty podle páru vrcholů
					if (e.source === 'NE' && e.target === 'ES') return { ...e, value: 0.45 }
					if (e.source === 'NE' && e.target === 'SN') return { ...e, value: 0.55 }
					if (e.source === 'NE' && e.target === 'WE') return { ...e, value: 0.35 } // L/H
					if (e.source === 'ES' && e.target === 'SN') return { ...e, value: 0.5 } 
					if (e.source === 'ES' && e.target === 'WE') return { ...e, value: 0.35 }
					if (e.source === 'ES' && e.target === 'WS') return { ...e, value: 0.45 } // L/H
					if (e.source === 'SN' && e.target === 'WE') return { ...e, value: 0.4 }
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
			text: 'Obarvíme vrchol WE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SN zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol ES modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NE žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'yellow' } : v
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
			text: 'Graf je nyní kompletně obarven a má chromatické číslo 4.',
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NE, WS}, S2 = {ES}, S3 = {SN, WS}, S4 = {WE, WS}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou, pro S3 modrou, pro S4 žlutou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WE žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'yellow' } : v
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
			text: 'Obarvíme vrchol ES zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol NE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Nakonec frakcionálně obarvíme vrchol WS - ze třetiny červenou, ze třetiny modrou a ze třetiny žlutou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: { type: 'fractional', colors: ['red', 'cyan', 'yellow'] } } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní frakcionálně obarven. Vrchol WS je ze třetiny červený, ze třetiny modrý a ze třetiny žlutý, což znamená, že využívá tři různé barvy s vahou 1/3 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.', // TODO: doplnit správné chromatické číslo https://www.pmcalculators.com/simplex-method-calculator/?problem=('cr![30929.1592.1298.0556.0825.0896.18824BcoA64~s!3777*BrA54~o!'Minimizar')*≥'-6'~.4,32'~03['4']5-16'~17*~*~8229-0A!3155B]~BA98765432.-*_
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
					if (e.source === 'NE' && e.target === 'ES') return { ...e, value: 0.45 }
					if (e.source === 'NE' && e.target === 'SN') return { ...e, value: 0.55 }
					if (e.source === 'NE' && e.target === 'WE') return { ...e, value: 0.35 } // L/H
					if (e.source === 'ES' && e.target === 'SN') return { ...e, value: 0.5 } 
					if (e.source === 'ES' && e.target === 'WE') return { ...e, value: 0.35 }
					if (e.source === 'ES' && e.target === 'WS') return { ...e, value: 0.2 } // L/H
					if (e.source === 'SN' && e.target === 'WE') return { ...e, value: 0.4 }
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je slabě sousedící dvojice vrcholů WS a ES.',
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
			text: 'Obarvíme vrchol SN zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol ES modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NE žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'yellow' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Nakonec obarvíme vrchol WS barvou jeho sousedního vrcholu ES (modrou).',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Graf je nyní kompletně obarven a má chromatické číslo 4.',
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NE}, S2 = {ES}, S3 = {SN}, S4 = {WE}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou, pro S3 modrou, pro S4 žlutou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WE žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'yellow' } : v
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
			text: 'Obarvíme vrchol ES zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol NE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Nakonec obarvíme vrchol WS barvou jeho sousedního vrcholu (zelenou).',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní obarven, avšak frakcionální barvení použito nebylo, protože nevznikají potřebné nezávislé množiny. Jeho chromatické číslo tedy zůstává 4.', 
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
					// Přiřadíme hodnoty podle páru vrcholů
					if (e.source === 'NE' && e.target === 'ES') return { ...e, value: 0.45 }
					if (e.source === 'NE' && e.target === 'SN') return { ...e, value: 0.55 }
					if (e.source === 'NE' && e.target === 'WE') return { ...e, value: 0.15 } // L/H
					if (e.source === 'ES' && e.target === 'SN') return { ...e, value: 0.5 } 
					if (e.source === 'ES' && e.target === 'WE') return { ...e, value: 0.35 }
					if (e.source === 'ES' && e.target === 'WS') return { ...e, value: 0.45 } // L/H
					if (e.source === 'SN' && e.target === 'WE') return { ...e, value: 0.4 }
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je slabě sousedící dvojice vrcholů NE a WE.',
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
			text: 'Obarvíme vrchol SN zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol ES modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NE barvou sousedního vrcholu WE, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
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
			text: 'Graf je nyní kompletně obarven a má chromatické číslo 3.',
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NE, WE, WS}, S2 = {ES}, S3 = {SN, WS}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou a pro S3 modrou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'red' } : v
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
			text: 'Obarvíme vrchol ES zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol NE barvou jeho sousedního vrcholu WE, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Nakonec frakcionálně obarvíme vrchol WS - z poloviny červeně a z poloviny modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: { type: 'fractional', colors: ['red', 'cyan'] } } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní frakcionálně obarven. Vrchol WS je z poloviny červený a z poloviny modrý s vahou 0,5 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.', // TODO: doplnit správné chromatické číslo https://www.pmcalculators.com/simplex-method-calculator/?problem=('cr![30929.1592.1298.0556.0825.0896.18824BcoA64~s!3777*BrA54~o!'Minimizar')*≥'-6'~.4,32'~03['4']5-16'~17*~*~8229-0A!3155B]~BA98765432.-*_
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
					// Přiřadíme hodnoty podle páru vrcholů
					if (e.source === 'NE' && e.target === 'ES') return { ...e, value: 0.45 }
					if (e.source === 'NE' && e.target === 'SN') return { ...e, value: 0.55 }
					if (e.source === 'NE' && e.target === 'WE') return { ...e, value: 0.15 } // L/H
					if (e.source === 'ES' && e.target === 'SN') return { ...e, value: 0.5 } 
					if (e.source === 'ES' && e.target === 'WE') return { ...e, value: 0.35 }
					if (e.source === 'ES' && e.target === 'WS') return { ...e, value: 0.2 } // L/H
					if (e.source === 'SN' && e.target === 'WE') return { ...e, value: 0.4 }
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě jsou dvě slabě sousedící dvojice vrcholů, a to NE a WE a také ES a WS.',
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
			text: 'Obarvíme vrchol SN zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol ES modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NE barvou jeho sousedního vrcholu WE, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol WS barvou jeho sousedniho vrcholu ES, modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'cyan' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NE, WE}, S2 = {ES}, S3 = {SN}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou a pro S3 modrou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'red' } : v
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
			text: 'Obarvíme vrchol ES zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol NE barvou jeho sousedního vrcholu WE, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Nakonec obarvíme vrchol WS barvou jeho sousedního vrcholu ES, zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WS' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní obarven. Avšak nebylo využito frakcionálního barvení, protože není výhodné oproti klasickému. Chromatické číslo tedy zůstává 3.', 
			noNumber: true
		}
	], {
		startStepNum: var4TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
		startDisplayNum: var4NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Export všech variant pro použití v hlavním konfiguračním souboru 
export const X_scheme_3_variants = {
  [variant1Id]: variant1Steps,
	[variant2Id]: variant2Steps,
	[variant3Id]: variant3Steps,
	[variant4Id]: variant4Steps,
}