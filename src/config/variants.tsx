/**
 * @file variants.tsx
 * @author Tomáš Barták
 * @description
 * Tento soubor obsahuje datový model, který definuje nezbytné datové struktury. Obsahuje například definici struktury grafu, společně s vrcholy a hranami.
 * Současně je zde definovaná také hierarchie aplikace a samotná forma jednotlivých kroků.
 */
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
  
/**
 * Rozhraní vrcholu grafu.
 * @interface Vertex
 * @property {string} id - Unikátní identifikátor vrcholu.
 * @property {string | { type: string, colors: string[] }} [color] - Barva vrcholu. Může být zadána buď jako řetězec (jednoduchá CSS barva) nebo objekt složený z typu a pole barev pro frakcionální barvení vrcholu.
 * @property {number} [value] - Hodnota vrcholu (volitelná).
 */
export interface Vertex {
  id: string
  color?: string | {
    type: string
    colors: string[]
  }
  value?: number
}

/**
 * Rozhraní hrany grafu.
 * @interface Edge
 * @property {string} source - Identifikátor vrcholu, ze kterého hrana vychází.
 * @property {string} target - Identifikátor vrcholu, do kterého hrana směřuje.
 * @property {number} [value] - Hodnota hrany (volitelná).
 * @property {'weak' | 'strong'} [type] - Typ hrany (slabá nebo silná, volitelná), v základu brána jako silná.
 */
export interface Edge {
  source: string
  target: string
  value?: number
  type?: 'weak' | 'strong'
}

/**
 * Rozhraní grafu.
 * @interface Graph
 * @property {Vertex[]} vertices - Pole vrcholů grafu.
 * @property {Edge[]} edges - Pole hran grafu.
 */
export interface Graph {
  vertices: Vertex[]
  edges: Edge[]
}

/**
 * Rozhraní pro konkrétní krok.
 * @property {string} id - Unikátní identifikátor kroku.
 * @property {string} description - Popis kroku.
 * @property {Function} [action] - Akce, která modifikuje graf (volitelná).
 */
export interface Step {
  id: string
  description: string
  action?: (graph: Graph) => Graph
}

/**
 * Rozhraní pro variantu křižovatky.
 * @property {string} id - Unikátní identifikátor varianty.
 * @property {string} name - Název varianty.
 * @property {Step[]} steps - Pole kroků varianty.
 */
export interface Variant {
  id: string
  name: string
  steps: Step[]
}

/**
 * Rozhraní pro schéma křižovatky.
 * @property {string} id - Unikátní identifikátor schématu.
 * @property {string} name - Název schématu.
 * @property {Variant[]} variants - Pole variant schématu.
 */
export interface IntersectionScheme {
  id: string
  name: string
  variants: Variant[]
}

/**
 * Rozhraní pro typ křižovatky.
 * @property {'T' | 'X'} type - Typ křižovatky (T nebo X).
 * @property {IntersectionScheme[]} schemes - Pole schémat křižovatky.
 */
export interface IntersectionType {
  type: 'T' | 'X'
  schemes: IntersectionScheme[]
}

/**
 * Kompletní hierarchie aplikace obsahující všechny typy, schémata a varianty křižovatek s odkazy na jejich kroky.
 * @type {IntersectionType[]}
 * @property {string} type - Typ křižovatky (T nebo X).
 * @property {IntersectionScheme[]} schemes - Pole schémat křižovatky.
 */
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