/**
 * @file scheme_utils.tsx
 * @author Tomáš Barták
 * @description
 * Tento soubor obsahuje pomocné funkce pro tvorbu kroků s automatickým číslováním.
 */
import { Step, Graph } from './variants';  
  
/**
 * Pomocná funkce pro vytvoření daného kroku
 * @param variantId Identifikátor varianty
 * @param stepNum Číslo kroku
 * @param displayNum Číslo pro zobrazení (pokud je null, číslo se nezobrazí)
 * @param description Popis kroku
 * @param action Akce, která modifikuje graf (volitelné)
 */
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

/**
 * Funkce pro vytváření kroků s automatickým číslováním
 * @param variantId Identifikátor varianty
 * @param descriptions Pole popisů kroků
 * @param descriptions.text Text popisu
 * @param descriptions.noNumber Pokud je true, číslo se nezobrazí
 * @param descriptions.action Akce, která modifikuje graf (volitelné)
 * @param options Nastavení funkce na správné hodnoty kroků
 * @returns Pole kroků
 */
export function createSteps(
	variantId: string,
	descriptions: Array<{
		text: string,
		noNumber?: boolean,
		action?: (graph: Graph) => Graph
	}>,
	options?: {
		startStepNum?: number,  // Počáteční hodnota pro ID kroků
		startDisplayNum?: number  // Počáteční hodnota pro zobrazovaná čísla
	}
): Step[] {
	let stepCounter = options?.startStepNum ?? 1; // Počítadlo pro ID, výchozí 1 nebo zadaná hodnota
	let displayCounter = options?.startDisplayNum ?? 1; // Počítadlo pro zobrazovaná čísla, výchozí 1 nebo zadaná hodnota
	
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

/**
 * Pomocná funkce pro získání počtu kroků a číslovaných kroků, aby bylo možné vytvořit společné kroky a na ně číselně navázat kroky specifické pro dané schéma.
 * @param steps Pole kroků
 * @returns Objekt s počtem kroků a počtem číslovaných kroků
 */
export function getStepCounts(steps: Step[]): { totalSteps: number, numberedSteps: number } {
  const totalSteps = steps.length;
  const numberedSteps = steps.filter(step => 
    step.description.startsWith('Krok ')
  ).length;
  
  return { totalSteps, numberedSteps };
}
