import { Step, Graph } from './variants';  
  
// Pomocná funkce pro vytvoření daného kroku
function createStep(
	variantId: string, 
	stepNum: number, 
	displayNum: number | null, // null pokud nechceme číslo "Krok X:" v popisu
	description: string,
	action?: (graph: Graph) => Graph
): Step {
	const desc = displayNum !== null 
		? `Krok ${displayNum}: ${description}` 
		: description;
	
	return {
		id: `${variantId}-step-${stepNum}`,
		description: desc,
		action
	};
}

// Funkce pro vytváření kroků s automatickým číslováním
export function createSteps(
	variantId: string,
	descriptions: Array<{
		text: string,
		noNumber?: boolean, // true, pokud nechceme číslo v popisu
		action?: (graph: Graph) => Graph // optional, může být jen popis
	}>,
	options?: {
		startStepNum?: number,  // počáteční hodnota pro ID kroků
		startDisplayNum?: number  // počáteční hodnota pro zobrazovaná čísla
	}
): Step[] {
	let stepCounter = options?.startStepNum ?? 1; // počítadlo pro ID, výchozí 1 nebo zadaná hodnota
	let displayCounter = options?.startDisplayNum ?? 1; // počítadlo pro zobrazovaná čísla, výchozí 1 nebo zadaná hodnota
	
	return descriptions.map(item => {
		const step = createStep(
			variantId,
			stepCounter++,
			item.noNumber ? null : displayCounter++,
			item.text,
			item.action
		);
		return step;
	});
}

// Pomocná funkce pro získání počtu kroků a číslovaných kroků, aby bylo možné vytvořit společné kroky a na ně číselně navázat kroky specifické pro dané schéma
export function getStepCounts(steps: Step[]): { totalSteps: number, numberedSteps: number } {
  const totalSteps = steps.length;
  const numberedSteps = steps.filter(step => 
    step.description.startsWith('Krok ')
  ).length;
  
  return { totalSteps, numberedSteps };
}
