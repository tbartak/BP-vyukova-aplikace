import { Step, Graph } from '../variants'
import { createSteps, getStepCounts } from '../scheme_utils'

// Definice ID variant
const variant1Id = 'X-scheme-4-var-1'
const variant2Id = 'X-scheme-4-var-2'
const variant3Id = 'X-scheme-4-var-3'
const variant4Id = 'X-scheme-4-var-4'

// Vrcholy jsou totožné pro všechny varianty X-scheme-4
const createVertices = (graph: Graph): Graph => ({
  ...graph,
  vertices: [
    ...graph.vertices,
    { id: 'NS' },
    { id: 'EW' },
    { id: 'SN' },
    { id: 'SW' },
    { id: 'WN' }
  ]
})

// Společné kroky pro všechny varianty X-scheme-4
const createCommonSteps = (variantId: string): Step[] => {
	return createSteps(variantId, [
		{
			text: 'Úvod: Na schématu křižovatky typu X je zobrazeno 5 možných průjezdů: NS, EW, SN, SW a WN. Tyto průjezdy budou tvořit vrcholy našeho grafu křižovatky.',
			noNumber: true
		},
		{
			text: 'Vytvoření všech vrcholů grafu (NS, EW, SN, SW, WN).',
			action: createVertices
		},
		{
			text: 'Přidáme hranu mezi vrcholy NS a EW, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NS', target: 'EW' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy NS a SW, reprezentující možný výskyt kolize mezi průjezdy.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NS', target: 'SW' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy NS a WN, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NS', target: 'WN' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy EW a SN, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'EW', target: 'SN' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy EW a WN, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'EW', target: 'WN' }]
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
			text: 'Přidáme hranu mezi vrcholy SN a WN, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'SN', target: 'WN' }]
			})
		},
        {
			text: 'Přidáme hranu mezi vrcholy SW a WN, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'SW', target: 'WN' }]
			})
		},
		{
			text: 'Ohodnotíme vrcholy podle intenzity provozu zvolené varianty.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v => {
					switch(v.id) {
						case 'NS': return { ...v, value: 0.8 } 
						case 'EW': return { ...v, value: 0.9 }       
						case 'SN': return { ...v, value: 0.7 }
						case 'SW': return { ...v, value: 0.6 }
						case 'WN': return { ...v, value: 0.6 }
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
					if (e.source === 'NS' && e.target === 'EW') return { ...e, value: 0.75 }
					if (e.source === 'NS' && e.target === 'SW') return { ...e, value: 0.55 }
					if (e.source === 'NS' && e.target === 'WN') return { ...e, value: 0.55 }
					if (e.source === 'EW' && e.target === 'SN') return { ...e, value: 0.7 } 
					if (e.source === 'EW' && e.target === 'WN') return { ...e, value: 0.6 }
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.6 } // L/H
					if (e.source === 'SN' && e.target === 'WN') return { ...e, value: 0.5 } // L/h
					if (e.source === 'SW' && e.target === 'WN') return { ...e, value: 0.4 }
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
			text: 'Obarvíme vrchol WN červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
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
			text: 'Obarvíme vrchol EW modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NS žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'yellow' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NS, SN}, S2 = {EW}, S3 = {SN, SW}, S4 = {WN}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou, pro S3 modrou a pro S4 žlutou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WN žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'yellow' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol SW modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'cyan' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Frakcionálně obarvíme vrchol SN - z poloviny červeně a z poloviny modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: { type: 'fractional', colors: ['red', 'cyan'] } } : v
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
			text: 'Obarvíme vrchol NS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní frakcionálně obarven. Vrchol SN je z poloviny červený a z poloviny modrý, což znamená, že využívá dvě různé barvy s vahou 0,5 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.', // TODO: doplnit správné chromatické číslo https://www.pmcalculators.com/simplex-method-calculator/?problem=('cr![30929.1592.1298.0556.0825.0896.18824BcoA64~s!3777*BrA54~o!'Minimizar')*≥'-6'~.4,32'~03['4']5-16'~17*~*~8229-0A!3155B]~BA98765432.-*_
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
					if (e.source === 'NS' && e.target === 'EW') return { ...e, value: 0.75 }
					if (e.source === 'NS' && e.target === 'SW') return { ...e, value: 0.55 }
					if (e.source === 'NS' && e.target === 'WN') return { ...e, value: 0.55 }
					if (e.source === 'EW' && e.target === 'SN') return { ...e, value: 0.7 } 
					if (e.source === 'EW' && e.target === 'WN') return { ...e, value: 0.6 }
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.25 } // L/H 0,6
					if (e.source === 'SN' && e.target === 'WN') return { ...e, value: 0.5 } // L/H 0,5
					if (e.source === 'SW' && e.target === 'WN') return { ...e, value: 0.4 }
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je jedna dvojice slabě sousedících vrcholů, a to EW a SW.',
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
			text: 'Obarvíme vrchol WN červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
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
			text: 'Obarvíme vrchol NS modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Nakonec obarvíme vrchol EW barvou jeho sousedního vrcholu, zelenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'yellowgreen' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NS, SN}, S2 = {EW, SW}, S3 = {SN, SW}, S4 = {WN}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou, pro S3 modrou a pro S4 žlutou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WN žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'yellow' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Ze simplexové metody vzešlo, že pro optimální řešení nezávislá množina S3 není třeba. Obarvíme tedy vrchol SW pouze zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Podobně tomu tak je i u vrcholu SN, který obarvíme pouze červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'red' } : v
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
			text: 'Obarvíme vrchol NS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní obarven. Frakcionální barvení v tomto případě nepřináší vyšší efektivitu. Chromatické číslo tedy stále zůstává 3.', 
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
					if (e.source === 'NS' && e.target === 'EW') return { ...e, value: 0.75 }
					if (e.source === 'NS' && e.target === 'SW') return { ...e, value: 0.55 }
					if (e.source === 'NS' && e.target === 'WN') return { ...e, value: 0.55 }
					if (e.source === 'EW' && e.target === 'SN') return { ...e, value: 0.7 } 
					if (e.source === 'EW' && e.target === 'WN') return { ...e, value: 0.6 }
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.6 } // L/H 0,6
					if (e.source === 'SN' && e.target === 'WN') return { ...e, value: 0.2 } // L/H 0,5
					if (e.source === 'SW' && e.target === 'WN') return { ...e, value: 0.4 }
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je jedna dvojice slabě sousedících vrcholů, a to SN a WN.',
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
			text: 'Obarvíme vrchol WN červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol EW modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NS žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'yellow' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Nakonec obarvíme vrchol SN barvou jeho sousedního vrcholu WN, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'red' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NS, SN}, S2 = {EW}, S3 = {SN, SW}, S4 = {SN, WN}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou, pro S3 modrou a pro S4 žlutou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WN žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'yellow' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol SW modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'cyan' } : v
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
			text: 'Obarvíme vrchol NS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Frakcionálně obarvíme vrchol SN - ze třetiny červeně, ze třetiny modře a ze třetiny žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: { type: 'fractional', colors: ['red', 'cyan', 'yellow'] } } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní frakcionálně obarven obarven. Vrchol SN je ze třetiny červený, ze třetiny modrý a ze třetiny žlutý, což znamená, že využívá tři různé barvy s vahou 1/3 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.', // TODO: doplnit správné chromatické číslo https://www.pmcalculators.com/simplex-method-calculator/?problem=('cr![30929.1592.1298.0556.0825.0896.18824BcoA64~s!3777*BrA54~o!'Minimizar')*≥'-6'~.4,32'~03['4']5-16'~17*~*~8229-0A!3155B]~BA98765432.-*_
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
					if (e.source === 'NS' && e.target === 'EW') return { ...e, value: 0.75 }
					if (e.source === 'NS' && e.target === 'SW') return { ...e, value: 0.55 }
					if (e.source === 'NS' && e.target === 'WN') return { ...e, value: 0.55 }
					if (e.source === 'EW' && e.target === 'SN') return { ...e, value: 0.7 } 
					if (e.source === 'EW' && e.target === 'WN') return { ...e, value: 0.6 }
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.25 } // L/H 0,6
					if (e.source === 'SN' && e.target === 'WN') return { ...e, value: 0.2 } // L/H 0,5
					if (e.source === 'SW' && e.target === 'WN') return { ...e, value: 0.4 }
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
			text: 'Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě jsou dvě dvojice slabě sousedících vrcholů, a to EW a SW a také SN a WN.',
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
			text: 'Obarvíme vrchol WN červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SW zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol NS modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Nakonec obarvíme vrchol SN barvou jeho sousedního vrcholu WN, červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Podobně také vrchol EW obarvíme barvou jeho sousedního vrcholu SW, zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EW' ? { ...v, color: 'yellowgreen' } : v
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NS, SN}, S2 = {EW, SW}, S3 = {SN, SW}, S4 = {SN, WN}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou, pro S3 modrou a pro S4 žlutou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, WN žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'yellow' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Ze simplexové metody vzešlo, že pro optimální řešení nezávislá množina S3 není třeba. Obarvíme tedy vrchol SW pouze zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellowgreen' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol NS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'red' } : v
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
			text: 'Frakcionálně obarvíme vrchol SN - z poloviny červeně a z poloviny žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: { type: 'fractional', colors: ['red', 'yellow'] } } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní frakcionálně obarven obarven. Vrchol SN je z poloviny červený a z poloviny žlutý, což znamená, že využívá dvě různé barvy s vahou 0,5 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.', // TODO: doplnit správné chromatické číslo https://www.pmcalculators.com/simplex-method-calculator/?problem=('cr![30929.1592.1298.0556.0825.0896.18824BcoA64~s!3777*BrA54~o!'Minimizar')*≥'-6'~.4,32'~03['4']5-16'~17*~*~8229-0A!3155B]~BA98765432.-*_
			noNumber: true
		}
	], {
		startStepNum: var4TotalSteps + 1, // Začátek číslování kroků pro tuto variantu
		startDisplayNum: var4NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu
	})
];

// Export všech variant pro použití v hlavním konfiguračním souboru 
export const X_scheme_4_variants = {
  [variant1Id]: variant1Steps,
	[variant2Id]: variant2Steps,
	[variant3Id]: variant3Steps,
	[variant4Id]: variant4Steps,
}