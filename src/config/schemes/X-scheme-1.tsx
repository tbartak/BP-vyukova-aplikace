import { Step, Graph } from '../variants'

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

// Kroky 1-10 jsou společné pro všechny varianty X-scheme-1
const createCommonSteps = (variantId: string): Step[] => [
	{
    id: `${variantId}-step-1`,
    description: 'Úvod: Na schématu křižovatky typu X je zobrazeno 5 možných průjezdů: NE, EW, WE, NS a SN. Tyto průjezdy budou tvořit vrcholy našeho grafu křižovatky.',
  },
  {
    id: `${variantId}-step-2`,
    description: 'Krok 1: Vytvoření všech vrcholů grafu (NE, EW, WE, NS, SN).',
    action: createVertices
  },
  {
    id: `${variantId}-step-3`,
    description: 'Krok 2: Přidáme hranu mezi vrcholy NE a EW, reprezentující možný výskyt kolize mezi průjezdy.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'NE', target: 'EW' }]
    })
  },
  {
    id: `${variantId}-step-4`,
    description: 'Krok 3: Přidáme hranu mezi vrcholy NE a WE, reprezentující možný výskyt kolize mezi průjezdy.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'NE', target: 'WE' }]
    })
  },
  {
    id: `${variantId}-step-5`,
    description: 'Krok 4: Přidáme hranu mezi vrcholy NE a SN, které se kříží, tedy může vzniknout kolize.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'NE', target: 'SN' }]
    })
  },
  {
    id: `${variantId}-step-6`,
    description: 'Krok 5: Přidáme hranu mezi vrcholy SN a EW, které se kříží, tedy může vzniknout kolize.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'SN', target: 'EW' }]
    })
  },
  {
    id: `${variantId}-step-7`,
    description: 'Krok 6: Přidáme hranu mezi vrcholy SN a WE, které se kříží, tedy může vzniknout kolize.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'SN', target: 'WE' }]
    })
  },
  {
    id: `${variantId}-step-8`,
    description: 'Krok 7: Přidáme hranu mezi vrcholy WE a NS, které se kříží, tedy může vzniknout kolize.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'WE', target: 'NS' }]
    })
  },
  {
    id: `${variantId}-step-9`,
    description: 'Krok 8: Nakonec přidáme hranu mezi vrcholy EW a NS, které se kříží, tedy může vzniknout kolize.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'EW', target: 'NS' }]
    })
  },
  {
    id: `${variantId}-step-10`,
    description: 'Krok 9: Ohodnotíme vrcholy podle intenzity provozu zvolené varianty.',
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
  },
]

// Varianta 1
export const variant1Steps: Step[] = [
  ...createCommonSteps(variant1Id),
  {
    id: `${variant1Id}-step-11`,
    description: 'Krok 10: Ohodnotíme hrany podle pravděpodobnosti kolize.',
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
        // atd. pro další hrany
        return { ...e, value: 0.5 } // výchozí hodnota
      })
      return { ...graph, edges: edgesWithValues }
    }
  },
  { // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
    id: `${variant1Id}-step-12`,
    description: 'Krok 11: Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), nicméně v této variantě žádné slabě sousedící vrcholy či hrany neexistují.',
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
    id: `${variant1Id}-step-13`,
    description: 'Dále je možné graf začít barvit jako u klasických grafů.'
  },
  {
    id: `${variant1Id}-step-14`,
    description: 'Krok 12: Obarvíme vrchol NE červeně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NE' ? { ...v, color: 'red' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: `${variant1Id}-step-15`,
    description: 'Krok 13: Obarvíme vrchol EW zeleně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'EW' ? { ...v, color: 'green' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: `${variant1Id}-step-16`,
    description: 'Krok 14: Obarvíme vrchol NS červeně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NS' ? { ...v, color: 'red' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: `${variant1Id}-step-17`,
    description: 'Krok 15: Obarvíme vrchol SN modře.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'SN' ? { ...v, color: 'blue' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: `${variant1Id}-step-18`,
    description: 'Krok 16: Obarvíme vrchol WE zeleně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'WE' ? { ...v, color: 'green' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  // Další kroky barvení...
  {
    id: `${variant1Id}-step-19`,
    description: 'Graf je nyní kompletně obarven a má chromatické číslo 3.',
    action: (graph: Graph) => {
      return graph;
    }
  },
  {
    id: `${variant1Id}-step-20`,
    description: 'Dále graf zkusíme obarvit ještě frakcionálně, což může pomoct nalézt optimálnější řešení nastavení křižovatky.',
  },
  {
    id: `${variant1Id}-step-21`,
    description: 'Reset barev: Vrátíme se do stavu před barvením a aplikujeme frakcionální barvení.',
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
    id: `${variant1Id}-step-22`,
    description: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NE, NS}, S2 = {EW, WE}, S3 = {SN, NS}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou a pro S3 modrou.',
  },
  {
    id: `${variant1Id}-step-23`,
    description: 'Krok 17: Obarvíme vrchol, dle barev nezávislých množin, NE červeně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NE' ? { ...v, color: 'red' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant1Id}-step-24`,
    description: 'Krok 18: Obarvíme vrchol EW zeleně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'EW' ? { ...v, color: 'green' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant1Id}-step-25`,
    description: 'Krok 19: Obarvíme vrchol SN modře.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'SN' ? { ...v, color: 'blue' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant1Id}-step-26`,
    description: 'Krok 20: Obarvíme vrchol WE zeleně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'WE' ? { ...v, color: 'green' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant1Id}-step-27`,
    description: 'Krok 21: Frakcionálně obarvíme vrchol NS - z poloviny červenou barvou a z poloviny modrou barvou.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NS' ? { ...v, color: 'linear-gradient(90deg, red 50%, blue 50%)' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant1Id}-step-28`,
    description: 'Graf je nyní frakcionálně obarven. Vrchol NS je z poloviny červený a z poloviny modrý, což znamená, že využívá dvě různé barvy s vahou 0.5 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.',
  }
]

// Varianta 2
export const variant2Steps: Step[] = [
  ...createCommonSteps(variant2Id),
  {
    id: `${variant2Id}-step-11`,
    description: 'Krok 10: Ohodnotíme hrany podle pravděpodobnosti kolize.',
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
        // atd. pro další hrany
        return { ...e, value: 0.5 } // výchozí hodnota
      })
      return { ...graph, edges: edgesWithValues }
    }
  },
  { // TODO: rozmyslet se, jestli to dělat takto dynamicky a nebo prostě vypsat konkrétní hranu jako weak
    id: `${variant2Id}-step-12`,
    description: 'Krok 11: Hledáme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů), v této variantě je jedna slabá hrana, a to mezi vrcholy WE a NE.',
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
    id: `${variant2Id}-step-13`,
    description: 'Dále je možné graf začít barvit jako u klasických grafů.'
  },
  {
    id: `${variant2Id}-step-14`,
    description: 'Krok 12: Obarvíme vrchol NE červeně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NE' ? { ...v, color: 'red' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: `${variant2Id}-step-15`,
    description: 'Krok 13: Obarvíme vrchol EW zeleně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'EW' ? { ...v, color: 'green' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: `${variant2Id}-step-16`,
    description: 'Krok 14: Obarvíme vrchol NS červeně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NS' ? { ...v, color: 'red' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: `${variant2Id}-step-17`,
    description: 'Krok 15: Obarvíme vrchol SN modře.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'SN' ? { ...v, color: 'blue' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: `${variant2Id}-step-18`,
    description: 'Krok 16: Obarvíme vrchol WE zeleně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'WE' ? { ...v, color: 'green' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  // Další kroky barvení...
  {
    id: `${variant2Id}-step-19`,
    description: 'Graf je nyní kompletně obarven a má chromatické číslo 3.',
    action: (graph: Graph) => {
      return graph;
    }
  },
  {
    id: `${variant2Id}-step-20`,
    description: 'Dále graf zkusíme obarvit ještě frakcionálně, což může pomoct nalézt optimálnější řešení nastavení křižovatky.',
  },
  {
    id: `${variant2Id}-step-21`,
    description: 'Reset barev: Vrátíme se do stavu před barvením a aplikujeme frakcionální barvení.',
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
    id: `${variant2Id}-step-22`,
    description: 'Nejprve identifikujeme nezávislé množiny mezi silně sousedícími vrcholy v grafu: S1 = {NE, NS}, S2 = {EW, WE}, S3 = {SN, NS}. Nezávislé množiny jsou skupiny vrcholů, které nejsou spojeny hranou. Pro každou z nich zvolíme jednu barvu, například pro S1 červenou, pro S2 zelenou a pro S3 modrou.',
  },
  {
    id: `${variant2Id}-step-23`,
    description: 'Krok 17: Obarvíme vrchol, dle barev nezávislých množin, NE červeně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NE' ? { ...v, color: 'red' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant2Id}-step-24`,
    description: 'Krok 18: Obarvíme vrchol EW zeleně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'EW' ? { ...v, color: 'green' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant2Id}-step-25`,
    description: 'Krok 19: Obarvíme vrchol SN modře.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'SN' ? { ...v, color: 'blue' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant2Id}-step-26`,
    description: 'Krok 20: Obarvíme vrchol WE zeleně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'WE' ? { ...v, color: 'green' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant2Id}-step-27`,
    description: 'Krok 21: Frakcionálně obarvíme vrchol NS - z poloviny červenou barvou a z poloviny modrou barvou.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NS' ? { ...v, color: 'linear-gradient(90deg, red 50%, blue 50%)' } : v
      );
      return { ...graph, vertices: newVertices };
    }
  },
  {
    id: `${variant2Id}-step-28`,
    description: 'Graf je nyní frakcionálně obarven. Vrchol NS je z poloviny červený a z poloviny modrý, což znamená, že využívá dvě různé barvy s vahou 0.5 každá. Díky tomuto přístupu můžeme dosáhnout chromatického čísla 2.5, což je lepší než původní chromatické číslo 3.',
  }
]

// Export všech variant pro použití v hlavním konfiguračním souboru
export const X_scheme_1_variants = {
  [variant1Id]: variant1Steps,
  [variant2Id]: variant2Steps,
}