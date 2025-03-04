import { T_scheme_1_variants } from './schemes/T-scheme-1'
import { T_scheme_2_variants } from './schemes/T-scheme-2'
import { T_scheme_3_variants } from './schemes/T-scheme-3'
import { T_scheme_4_variants } from './schemes/T-scheme-4'
import { T_scheme_5_variants } from './schemes/T-scheme-5'
import { X_scheme_1_variants } from './schemes/X-scheme-1'
import { X_scheme_2_variants } from './schemes/X-scheme-2'
import { X_scheme_3_variants } from './schemes/X-scheme-3'
import { X_scheme_4_variants } from './schemes/X-scheme-4'
import { X_scheme_5_variants } from './schemes/X-scheme-5'
  
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
          name: 'Schéma 1',
          variants: [
            {
              id: 'T-scheme-1-var-1',
              name: 'Varianta 1',
              steps: T_scheme_1_variants['T-scheme-1-var-1']
            },
            {
              id: 'T-scheme-1-var-2',
              name: 'Varianta 2',
              steps: T_scheme_1_variants['T-scheme-1-var-2']
            },
            {
              id: 'T-scheme-1-var-3',
              name: 'Varianta 3',
              steps: T_scheme_1_variants['T-scheme-1-var-3']
            },
            {
              id: 'T-scheme-1-var-4',
              name: 'Varianta 4',
              steps: T_scheme_1_variants['T-scheme-1-var-4']
            },
          ]
        },
        {
          id: 'T-scheme-2',
          name: 'Schéma 2',
          variants: [
            {
              id: 'T-scheme-2-var-1',
              name: 'Varianta 1',
              steps: T_scheme_2_variants['T-scheme-2-var-1']
            },
            {
              id: 'T-scheme-2-var-2',
              name: 'Varianta 2',
              steps: T_scheme_2_variants['T-scheme-2-var-2']
            },
            {
              id: 'T-scheme-2-var-3',
              name: 'Varianta 3',
              steps: T_scheme_2_variants['T-scheme-2-var-3']
            },
            {
              id: 'T-scheme-2-var-4',
              name: 'Varianta 4',
              steps: T_scheme_2_variants['T-scheme-2-var-4']
            },
          ]
        },
        {
          id: 'T-scheme-3',
          name: 'Schéma 3',
          variants: [
            {
              id: 'T-scheme-3-var-1',
              name: 'Varianta 1',
              steps: T_scheme_3_variants['T-scheme-3-var-1']
            },
            {
              id: 'T-scheme-3-var-2',
              name: 'Varianta 2',
              steps: T_scheme_3_variants['T-scheme-3-var-2']
            },
            {
              id: 'T-scheme-3-var-3',
              name: 'Varianta 3',
              steps: T_scheme_3_variants['T-scheme-3-var-3']
            },
            {
              id: 'T-scheme-3-var-4',
              name: 'Varianta 4',
              steps: T_scheme_3_variants['T-scheme-3-var-4']
            },
          ]
        },
        {
          id: 'T-scheme-4',
          name: 'Schéma 4',
          variants: [
            {
              id: 'T-scheme-4-var-1',
              name: 'Varianta 1',
              steps: T_scheme_4_variants['T-scheme-4-var-1']
            },
            {
              id: 'T-scheme-4-var-2',
              name: 'Varianta 2',
              steps: T_scheme_4_variants['T-scheme-4-var-2']
            },
            {
              id: 'T-scheme-4-var-3',
              name: 'Varianta 3',
              steps: T_scheme_4_variants['T-scheme-4-var-3']
            },
            {
              id: 'T-scheme-4-var-4',
              name: 'Varianta 4',
              steps: T_scheme_4_variants['T-scheme-4-var-4']
            },
          ]
        },
        {
          id: 'T-scheme-5',
          name: 'Schéma 5',
          variants: [
            {
              id: 'T-scheme-5-var-1',
              name: 'Varianta 1',
              steps: T_scheme_5_variants['T-scheme-5-var-1']
            },
            {
              id: 'T-scheme-5-var-2',
              name: 'Varianta 2',
              steps: T_scheme_5_variants['T-scheme-5-var-2']
            },
            {
              id: 'T-scheme-5-var-3',
              name: 'Varianta 3',
              steps: T_scheme_5_variants['T-scheme-5-var-3']
            },
            {
              id: 'T-scheme-5-var-4',
              name: 'Varianta 4',
              steps: T_scheme_5_variants['T-scheme-5-var-4']
            },
          ]
        },
      ]
    },
    {
      type: 'X',
      schemes: [
        {
          id: 'X-scheme-1',
          name: 'Schéma 1',
          variants: [
            {
              id: 'X-scheme-1-var-1',
              name: 'Varianta 1',
              steps: X_scheme_1_variants['X-scheme-1-var-1']
            },
            {
              id: 'X-scheme-1-var-2',
              name: 'Varianta 2',
              steps: X_scheme_1_variants['X-scheme-1-var-2']
            },
            {
              id: 'X-scheme-1-var-3',
              name: 'Varianta 3',
              steps: X_scheme_1_variants['X-scheme-1-var-3']
            },
            {
              id: 'X-scheme-1-var-4',
              name: 'Varianta 4',
              steps: X_scheme_1_variants['X-scheme-1-var-4']
            },
						{ // TODO: potom odstranit
							id: 'X-scheme-1-var-demo',
							name: 'Demo varianta',
							steps: generateDemoSteps('X-scheme-1-var-demo')
						},
          ]
        },
        {
          id: 'X-scheme-2',
          name: 'Schéma 2',
          variants: [
            {
              id: 'X-scheme-2-var-1',
              name: 'Varianta 1',
              steps: X_scheme_2_variants['X-scheme-2-var-1']
            },
            {
              id: 'X-scheme-2-var-2',
              name: 'Varianta 2',
              steps: X_scheme_2_variants['X-scheme-2-var-2']
            },
            {
              id: 'X-scheme-2-var-3',
              name: 'Varianta 3',
              steps: X_scheme_2_variants['X-scheme-2-var-3']
            },
            {
              id: 'X-scheme-2-var-4',
              name: 'Varianta 4',
              steps: X_scheme_2_variants['X-scheme-2-var-4']
            },
          ]
        },
        {
          id: 'X-scheme-3',
          name: 'Schéma 3',
          variants: [
            {
              id: 'X-scheme-3-var-1',
              name: 'Varianta 1',
              steps: X_scheme_3_variants['X-scheme-3-var-1']
            },
            {
              id: 'X-scheme-3-var-2',
              name: 'Varianta 2',
              steps: X_scheme_3_variants['X-scheme-3-var-2']
            },
            {
              id: 'X-scheme-3-var-3',
              name: 'Varianta 3',
              steps: X_scheme_3_variants['X-scheme-3-var-3']
            },
            {
              id: 'X-scheme-3-var-4',
              name: 'Varianta 4',
              steps: X_scheme_3_variants['X-scheme-3-var-4']
            },
          ]
        },
        {
          id: 'X-scheme-4',
          name: 'Schéma 4',
          variants: [
            {
              id: 'X-scheme-4-var-1',
              name: 'Varianta 1',
              steps: X_scheme_4_variants['X-scheme-4-var-1']
            },
            {
              id: 'X-scheme-4-var-2',
              name: 'Varianta 2',
              steps: X_scheme_4_variants['X-scheme-4-var-2']
            },
            {
              id: 'X-scheme-4-var-3',
              name: 'Varianta 3',
              steps: X_scheme_4_variants['X-scheme-4-var-3']
            },
            {
              id: 'X-scheme-4-var-4',
              name: 'Varianta 4',
              steps: X_scheme_4_variants['X-scheme-4-var-4']
            },
          ]
        },
        {
          id: 'X-scheme-5',
          name: 'Schéma 5',
          variants: [
            {
              id: 'X-scheme-5-var-1',
              name: 'Varianta 1',
              steps: X_scheme_5_variants['X-scheme-5-var-1']
            },
            {
              id: 'X-scheme-5-var-2',
              name: 'Varianta 2',
              steps: X_scheme_5_variants['X-scheme-5-var-2']
            },
            {
              id: 'X-scheme-5-var-3',
              name: 'Varianta 3',
              steps: X_scheme_5_variants['X-scheme-5-var-3']
            },
            {
              id: 'X-scheme-5-var-4',
              name: 'Varianta 4',
              steps: X_scheme_5_variants['X-scheme-5-var-4']
            },
          ]
        },
      ]
    }
  ]

  // TODO: potom odstranit
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
  
  // Pomocná funkce pro generování kroků s náhodným textem // TODO: později odstranit
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