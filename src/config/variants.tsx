  export interface Vertex {
    id: string
    color?: string
    value?: number
  }

  export interface Edge {
    source: string
    target: string
    color?: string
    value?: number
    type?: 'weak' | 'strong'
  }
  
  export interface Graph {
		vertices: Vertex[]
		edges: Edge[]
	}
	
	export interface Step {
    id: string
    description: string
    // Akce, která modifikuje graf; nepovinná, pokud jen popisujeme
  	action?: (graph: Graph) => Graph
  }
  
  export interface Variant {
    id: string
    name: string
    steps: Step[]
  }
  
  export interface IntersectionScheme {
    id: string
    name: string
    variants: Variant[]
  }
  
  export interface IntersectionType {
    type: 'T' | 'X'
    schemes: IntersectionScheme[]
  }
  
  export const intersectionConfig: IntersectionType[] = [
    {
      type: 'T',
      schemes: [
        {
          id: 'T-scheme-1',
          name: 'Křižovatka T - schéma 1',
          variants: [
            {
              id: 'T-scheme-1-var-1',
              name: 'Variant 1',
              steps: generateSteps('T-scheme-1-var-1') // funkce pro generování 20 kroků
            },
            {
              id: 'T-scheme-1-var-2',
              name: 'Variant 2',
              steps: generateSteps('T-scheme-1-var-2')
            },
            {
              id: 'T-scheme-1-var-3',
              name: 'Variant 3',
              steps: generateSteps('T-scheme-1-var-3')
            },
            {
              id: 'T-scheme-1-var-4',
              name: 'Variant 4',
              steps: generateSteps('T-scheme-1-var-4')
            },
						{
							id: 'T-scheme-1-var-demo',
							name: 'Demo varianta',
							steps: generateDemoSteps('T-scheme-1-var-demo')
						},
          ]
        },
        // Přidejte další 4 schémata k typu T
      ]
    },
    {
      type: 'X',
      schemes: [
        {
          id: 'X-scheme-1',
          name: 'Křižovatka X - schéma 1',
          variants: [
            {
              id: 'X-scheme-1-var-1',
              name: 'Variant 1',
              steps: generateSteps('X-scheme-1-var-1')
            },
            {
              id: 'X-scheme-1-var-2',
              name: 'Variant 2',
              steps: generateSteps('X-scheme-1-var-2')
            },
            {
              id: 'X-scheme-1-var-3',
              name: 'Variant 3',
              steps: generateSteps('X-scheme-1-var-3')
            },
            {
              id: 'X-scheme-1-var-4',
              name: 'Variant 4',
              steps: generateSteps('X-scheme-1-var-4')
            },
						{
							id: 'X-scheme-1-var-demo',
							name: 'Demo varianta',
							steps: generateDemoSteps('X-scheme-1-var-demo')
						},
          ]
        },
        // Přidejte další 4 schémata k typu X
      ]
    }
  ]

	function generateDemoSteps(prefix: string): Step[] {
    return [
      {
        id: `${prefix}-step-1`,
        description: 'Přidání vrcholu A',
        action: (graph) => ({ 
          ...graph, 
          vertices: [...graph.vertices, { id: 'A' }] 
        })
      },
      {
        id: `${prefix}-step-2`,
        description: 'Přidání vrcholu B',
        action: (graph) => ({ 
          ...graph, 
          vertices: [...graph.vertices, { id: 'B' }] 
        })
      },
      {
        id: `${prefix}-step-3`,
        description: 'Spojení vrcholů A a B hranou',
        action: (graph) => ({ 
          ...graph, 
          edges: [...graph.edges, { source: 'A', target: 'B' }] 
        })
      },
      {
        id: `${prefix}-step-4`,
        description: 'Obarvení vrcholu A červeně',
        action: (graph) => {
          const newVertices = graph.vertices.map(v =>
            v.id === 'A' ? { ...v, color: 'red' } : v
          )
          return { ...graph, vertices: newVertices }
        }
      },
      {
        id: `${prefix}-step-5`,
        description: 'Obarvení hrany mezi A a B modře',
        action: (graph) => {
          const newEdges = graph.edges.map(e =>
            (e.source === 'A' && e.target === 'B') ? { ...e, color: 'blue' } : e
          )
          return { ...graph, edges: newEdges }
        }
      },
      {
        id: `${prefix}-step-6`,
        description: 'Přidání hodnoty 5 vrcholu B',
        action: (graph) => {
          const newVertices = graph.vertices.map(v =>
            v.id === 'B' ? { ...v, value: 5 } : v
          )
          return { ...graph, vertices: newVertices }
        }
      }
    ]
  }
  
  // Pomocná funkce pro generování kroků s náhodným textem 
  function generateSteps(prefix: string): Step[] {
    const steps: Step[] = []
    for (let i = 1; i <= 20; i++) {
      steps.push({
        id: `${prefix}-step-${i}`,
        description: `Krok ${i}: Popis pro ${prefix}.`,
        // případně další data jako např. reference na komponentu
      })
    }
    return steps
  }