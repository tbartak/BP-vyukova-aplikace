export interface Step {
    id: string
    description: string
    // případně reference na komponentu, která vykreslí detail kroku
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
          ]
        },
        // Přidejte další 4 schémata k typu X
      ]
    }
  ]
  
  // Pomocná funkce pro generování kroků s náhodným textem 
  function generateSteps(prefix: string): Step[] {
    const steps: Step[] = []
    for (let i = 1; i <= 20; i++) {
      steps.push({
        id: `${prefix}-step-${i}`,
        description: `Krok ${i}: Popis pro ${prefix}.`
        // případně další data jako např. reference na komponentu
      })
    }
    return steps
  }