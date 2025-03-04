import { Step, Graph } from '../variants'

// Sdílené kroky pro všechny varianty X-scheme-1
const createBasicVertices = (graph: Graph): Graph => ({
  ...graph,
  vertices: [
    ...graph.vertices,
    { id: 'NS' },
    { id: 'NE' },
    { id: 'EW' },
    { id: 'ES' },
    { id: 'SW' },
    { id: 'WN' }
  ]
})

// Varianta 1 - Normální (klasické) barvení
export const variant1Steps: Step[] = [
  {
    id: 'X-scheme-1-var-1-step-1',
    description: 'Úvod: Na schématu křižovatky typu X je zobrazeno 6 možných průjezdů: NS, NE, EW, ES, SW a WN. Tyto průjezdy budou tvořit vrcholy našeho grafu.',
  },
  {
    id: 'X-scheme-1-var-1-step-2',
    description: 'Krok 1: Vytvoření všech vrcholů grafu najednou',
    action: createBasicVertices
  },
  {
    id: 'X-scheme-1-var-1-step-3',
    description: 'Krok 2: Přidáme hrany mezi vrcholy NS a EW, které reprezentují křížící se průjezdy.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'NS', target: 'EW' }]
    })
  },
  {
    id: 'X-scheme-1-var-1-step-4',
    description: 'Krok 3: Přidáme hranu mezi vrcholy NS a ES, které se kříží.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'NS', target: 'ES' }]
    })
  },
  {
    id: 'X-scheme-1-var-1-step-5',
    description: 'Krok 4: Přidáme hranu mezi vrcholy NS a WN, které se kříží.',
    action: (graph: Graph) => ({
      ...graph,
      edges: [...graph.edges, { source: 'NS', target: 'WN' }]
    })
  },
  // Další hrany...
  {
    id: 'X-scheme-1-var-1-step-10',
    description: 'Krok 9: Ohodnotíme vrcholy podle intenzity provozu.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v => {
        switch(v.id) {
          case 'NS': return { ...v, value: 0.8 }
          case 'NE': return { ...v, value: 0.6 }
          case 'EW': return { ...v, value: 0.9 }
          case 'ES': return { ...v, value: 0.7 }
          case 'SW': return { ...v, value: 0.6 }
          case 'WN': return { ...v, value: 0.5 }
          default: return v
        }
      })
      return { ...graph, vertices: newVertices }
    }
  },
  {
    id: 'X-scheme-1-var-1-step-11',
    description: 'Krok 10: Ohodnotíme hrany podle pravděpodobnosti kolize.',
    action: (graph: Graph) => {
      // Ohodnocení všech hran najednou pro názornost
      const edgesWithValues = graph.edges.map(e => {
        // Přiřadíme hodnoty podle páru vrcholů
        if (e.source === 'NS' && e.target === 'EW') return { ...e, value: 0.7 }
        if (e.source === 'NS' && e.target === 'ES') return { ...e, value: 0.6 }
        // atd. pro další hrany
        return { ...e, value: 0.5 } // výchozí hodnota
      })
      return { ...graph, edges: edgesWithValues }
    }
  },
  {
    id: 'X-scheme-1-var-1-step-12',
    description: 'Krok 11: Určíme slabé hrany (kde hodnota hrany je menší než polovina hodnoty menšího z vrcholů).',
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
    id: 'X-scheme-1-var-1-step-13',
    description: 'Krok 12: Odstraníme slabé hrany pro účely barvení.',
    action: (graph: Graph) => ({
      ...graph,
      edges: graph.edges.filter(e => e.type !== 'weak')
    })
  },
  {
    id: 'X-scheme-1-var-1-step-14',
    description: 'Krok 13: Obarvíme vrchol NS červeně.',
    action: (graph: Graph) => {
      const newVertices = graph.vertices.map(v =>
        v.id === 'NS' ? { ...v, color: 'red' } : v
      )
      return { ...graph, vertices: newVertices }
    }
  },
  // Další kroky barvení...
  {
    id: 'X-scheme-1-var-1-step-20',
    description: 'Krok 19: Přidáme zpět slabé hrany do grafu. Graf je nyní kompletně obarven a má chromatické číslo 3.',
    action: (graph: Graph) => {
      // Tady byste implementovali přidání slabých hran zpět do grafu
      return graph;
    }
  }
]

// Varianta 2 - Frakcionální barvení
export const variant2Steps: Step[] = [
  {
    id: 'X-scheme-1-var-2-step-1',
    description: 'Úvod: Ukážeme si frakcionální barvení grafu pro křižovatku typu X.',
    // Sdílí většinu kroků s variantou 1...
  },
  // ...další kroky
]

// Varianta 3 - Další příklad
export const variant3Steps: Step[] = [
  // ...
]

// Varianta 4 - Další příklad
export const variant4Steps: Step[] = [
  // ...
]

// Export všech variant pro použití v hlavním konfiguračním souboru
export const X_scheme_1_variants = {
  'X-scheme-1-var-1': variant1Steps,
  'X-scheme-1-var-2': variant2Steps,
  'X-scheme-1-var-3': variant3Steps,
  'X-scheme-1-var-4': variant4Steps,
}