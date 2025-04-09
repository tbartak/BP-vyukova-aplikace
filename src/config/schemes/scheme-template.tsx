import { Step, Graph } from '../variants'
import { createSteps, getStepCounts } from '../scheme_utils'

// TODO: popsat změny do dokumentace BP

// Definice ID variant // TODO: needs changing for new variant (numbers/types)
const variant1Id = 'X-scheme-2-var-1'
const variant2Id = 'X-scheme-2-var-2'
// TODO: ... další varianty

// Vrcholy jsou totožné pro všechny varianty X-scheme-2 // TODO: change comment number for new scheme
const createVertices = (graph: Graph): Graph => ({
  ...graph,
  vertices: [
    ...graph.vertices,
    { id: 'NS' },
    { id: 'EN' },
    { id: 'EW' },
    { id: 'SE' },
    { id: 'SN' },    
    { id: 'SW' },
    { id: 'WE' }
  ]
})

// Společné kroky pro všechny varianty X-scheme-2 // TODO: change comment numbers for new scheme + change content based on common steps
const createCommonSteps = (variantId: string): Step[] => {
	return createSteps(variantId, [
		{
			text: 'Úvod: Na schématu křižovatky typu X je zobrazeno 7 možných průjezdů: NS, EN, EW, SE, SN, SW a WE. Tyto průjezdy budou tvořit vrcholy našeho grafu křižovatky.',
			noNumber: true
		},
		{
			text: 'Vytvoření všech vrcholů grafu (NS, EN, EW, SE, SN, SW, WE).',
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
			text: 'Přidáme hranu mezi vrcholy NS a WE, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'NS', target: 'WE' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy EN a SN, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'EN', target: 'SN' }]
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
			text: 'Přidáme hranu mezi vrcholy EW a SW, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'EW', target: 'SW' }]
			})
		},
		{
			text: 'Přidáme hranu mezi vrcholy SE a WE, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'SE', target: 'WE' }]
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
			text: 'Nakonec přidáme hranu mezi vrcholy SW a WE, které se kříží, tedy může vzniknout kolize.',
			action: (graph: Graph) => ({
				...graph,
				edges: [...graph.edges, { source: 'SW', target: 'WE' }]
			})
		},
		{
			text: 'Ohodnotíme vrcholy podle intenzity provozu zvolené varianty.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v => {
					switch(v.id) {
						case 'NS': return { ...v, value: 0.6 } 
						case 'EN': return { ...v, value: 0.5 }       
						case 'EW': return { ...v, value: 0.7 }
						case 'SE': return { ...v, value: 0.5 }
						case 'SN': return { ...v, value: 0.7 }
						case 'SW': return { ...v, value: 0.6 }
						case 'WE': return { ...v, value: 0.7 }
						default: return v
					}
				})
				return { ...graph, vertices: newVertices }
			}
		}
	]);
};

// Vytvoření společných kroků // TODO: add for every variant
const commonStepsVar1 = createCommonSteps(variant1Id);
const commonStepsVar2 = createCommonSteps(variant2Id);

// Získání počtu kroků v společné části // TODO: add for every variant
const { totalSteps: var1TotalSteps, numberedSteps: var1NumberedSteps } = getStepCounts(commonStepsVar1);
const { totalSteps: var2TotalSteps, numberedSteps: var2NumberedSteps } = getStepCounts(commonStepsVar2);

// Varianta 1 // TODO: change content based on the scheme
export const variant1Steps: Step[] = [
  ...commonStepsVar1,
	...createSteps(variant1Id, [
		{
			text: 'Ohodnotíme hrany podle pravděpodobnosti kolize.',
			action: (graph: Graph) => {
				// Ohodnocení všech hran najednou pro názornost
				const edgesWithValues = graph.edges.map(e => {
					// Přiřadíme hodnoty podle páru vrcholů
					if (e.source === 'NS' && e.target === 'EW') return { ...e, value: 0.45 }
					if (e.source === 'NS' && e.target === 'SW') return { ...e, value: 0.4 }
					if (e.source === 'NS' && e.target === 'WE') return { ...e, value: 0.45 }
					if (e.source === 'EN' && e.target === 'SN') return { ...e, value: 0.35 } // TODO: vyznačit L/H a původní hodnotu vrcholů a hran
					if (e.source === 'EW' && e.target === 'SN') return { ...e, value: 0.6 }
					if (e.source === 'EW' && e.target === 'SW') return { ...e, value: 0.55 }
					if (e.source === 'SE' && e.target === 'WE') return { ...e, value: 0.6 }
					if (e.source === 'SN' && e.target === 'WE') return { ...e, value: 0.65 }
					if (e.source === 'SW' && e.target === 'WE') return { ...e, value: 0.6 }
					// TODO: atd. pro další hrany
					return { ...e, value: 0.5 } // výchozí hodnota
				})
				return { ...graph, edges: edgesWithValues }
			}
		},
		{ // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak // TODO: změnit popisek podle slabých/silných vrcholů a hran
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
			text: 'Obarvíme vrchol NS červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'red' } : v
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
			text: 'Obarvíme vrchol SW modře.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SN červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Obarvíme vrchol SE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SE' ? { ...v, color: 'red' } : v
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
			text: 'Obarvíme vrchol EN zeleně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EN' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		// TODO: Další kroky barvení...
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
			text: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {EN, WE, EW}, S2 = {EN, SE, NS}, S3 = {EN, SE, EW}, S4 = {EN, SE, SW}, S5 = {SN, SE, NS}, S6 = {SN, SE, SW}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou, pro S3 modrou, pro S4 žlutou, pro S5 fialovou a pro S6 oranžovou.',
			noNumber: true
		},
		{
			text: 'Následně přiřadíme každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně obarven. Tento krok je řešen simplexovou metodou lineárního programování, viz. http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Obarvíme vrchol, dle barev nezávislých množin, NS fialově.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'mediumpurple' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol WE červeně.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WE' ? { ...v, color: 'red' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol SW žlutě.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'yellow' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Obarvíme vrchol SN fialově.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SN' ? { ...v, color: 'mediumpurple' } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Frakcionálně obarvíme vrchol SE - z poloviny žlutou barvou a z poloviny fialovou barvou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SE' ? { ...v, color: { type: 'fractional', colors: ['yellow', 'mediumpurple'] } } : v
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
			text: 'Frakcionálně obarvíme vrchol EN - z poloviny červenou barvou a z poloviny žlutou barvou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'EN' ? { ...v, color: { type: 'fractional', colors: ['red', 'yellow'] } } : v
				);
				return { ...graph, vertices: newVertices };
			}
		},
		{
			text: 'Graf je nyní frakcionálně obarven. Vrchol SE je z poloviny žlutý a z poloviny fialový, což znamená, že využívá dvě různé barvy s vahou 0.5 každá. Podobně je tomu také u vrcholu EN, který je z poloviny červený a z poloviny žlutý. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.', // TODO: doplnit správné chromatické číslo https://www.pmcalculators.com/simplex-method-calculator/?problem=('cr![30929.1592.1298.0556.0825.0896.18824BcoA64~s!3777*BrA54~o!'Minimizar')*≥'-6'~.4,32'~03['4']5-16'~17*~*~8229-0A!3155B]~BA98765432.-*_
			noNumber: true
		}
	], {
		startStepNum: var1TotalSteps + 1, // Začátek číslování kroků pro tuto variantu // TODO: change for every variant
    startDisplayNum: var1NumberedSteps // Začátek číslování zobrazených kroků pro tuto variantu // TODO: change for every variant
	})
];

// TODO: ...dodělat další varianty

// Export všech variant pro použití v hlavním konfiguračním souboru 
export const X_scheme_2_variants = {// TODO: needs changing for new variant
  [variant1Id]: variant1Steps,
  // TODO: ... další varianty
}