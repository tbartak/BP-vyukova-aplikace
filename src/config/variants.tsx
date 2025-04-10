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
    color?: string | {
      type: string // Fractional coloring if type == 'fractional'
      colors: string[] // List of all colors that the vertex should be fractionally colored with
    }
    value?: number
  }

  export interface Edge {
    source: string
    target: string
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