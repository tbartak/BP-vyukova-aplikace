import { useState, useCallback } from 'react'
import { Box, Typography, Button } from '@mui/material'
import Wizard from '../components/GraphWizard/Wizard'
import IntersectionGraph from '../components/IntersectionGraph'
import { Graph, Step } from '../config/variants'
import { useNavigate } from 'react-router-dom'

// TODO: Probrat, jestli by bylo lepší vždycky prvně uvést popisek a pak po kliknutí na další teprve upravit graf, takže jakoby každý krok rozdělit na dva, v jednom by se jenom změnil description, ve druhým zůstane description stejnej, ale přidá se akce
const tutorialSteps: Step[] = [
  {
    id: 'tut-1',
    description: 'Úvod: Představení základních pojmů a informací. Pro jednoduchost jsou jednotlivé cesty křižovatky označeny světovými stranami (N - sever, E - východ, S - jih, W - západ). Každá křižovatka se dá převést na graf, kde vrcholy představují jednotlivé průjezdy křižovatkou a hrany znázorňují možné konflikty mezi těmito průjezdy. Podrobně si to ukážeme v následujících krocích.',
  },
	{
    id: 'tut-2',
    description: 'Následující kroky budou zaměřeny na vytvoření vrcholů ze schématu křižovatky. V pravé části obrazovky je zobrazený samotný graf, který bude postupně vytvářen.',
  },
  {
    id: 'tut-3',
    description: 'Krok 1: Tvorba vrcholů: Začneme průjezdy křižovatkou ze směru N (sever), kde existuje například průjezd NS (neboli průjezd křižovatkou z N do S). Přidáme tedy vrchol, který nazveme NS.',
    action: (graph: Graph) => ({ 
        ...graph, 
        vertices: [...graph.vertices, { id: 'NS' }] 
    }),
	},
	{
    id: 'tut-4',
    description: 'Krok 2: Tvorba vrcholů: Podobným způsobem jako v předešlém kroku můžeme přidat taktéž průjezd křižovatkou ze směru N do E. Přidáme tedy nový vrchol pod názvem NE.',
    action: (graph: Graph) => ({ 
        ...graph, 
        vertices: [...graph.vertices, { id: 'NE' }] 
    }),
	},
	{
    id: 'tut-5',
    description: 'Krok 3: Tvorba vrcholů: Přesuneme se k průjezdům křižovatkou ze směru E (východ). Z tohoto směru má křižovatka jediný možný průjezd a to do S. Přidáme tedy vrchol ES.',
    action: (graph: Graph) => ({ 
        ...graph, 
        vertices: [...graph.vertices, { id: 'ES' }] 
    }),
	},
	{
    id: 'tut-6',
    description: 'Krok 4: Tvorba vrcholů: Další v pořadí jsou průjezdy křižovatkou ze směru S (jih). Z tohoto směru také pouze jeden možný průjezd křižovatkou, a to do W. Přidáme tedy vrchol SW.',
    action: (graph: Graph) => ({ 
        ...graph, 
        vertices: [...graph.vertices, { id: 'SW' }] 
    }),
	},
	{
    id: 'tut-7',
    description: 'Krok 5: Tvorba vrcholů: Jako poslední zbývá průjezd křižovatkou ze směru W (západ). Z tohoto směru máme opět pouze jeden možný průjezd křižovatkou, a to do N. Přidáme tedy vrchol WN.',
    action: (graph: Graph) => ({ 
        ...graph, 
        vertices: [...graph.vertices, { id: 'WN' }] 
    }),
	},
	{
    id: 'tut-8',
    description: 'Po vytvoření všech vrcholů můžeme pokračovat v tvorbě hran. V dalších krocích se zaměříme na propojení jednotlivých průjezdů křižovatkou na základě možných konfliktů mezi nimi.',
  },
  {
    id: 'tut-9',
    description: 'Krok 6: Tvorba hran: První hranu vytvoříme mezi průjezdy křižovatkou NS a SW. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do S a ze směru S do W.',
    action: (graph: Graph) => ({ 
      ...graph, 
      edges: [...graph.edges, { source: 'NS', target: 'SW' }] 
    }),
  },
	{
    id: 'tut-10',
    description: 'Krok 7: Tvorba hran: Další hranu vytvoříme mezi průjezdy křižovatkou NS a WN. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do S a ze směru W do N.',
    action: (graph: Graph) => ({ 
      ...graph, 
      edges: [...graph.edges, { source: 'NS', target: 'WN' }] 
    }),
  },
	{
		id: 'tut-11',
		description: 'Krok 8: Tvorba hran: Další hranu vytvoříme mezi průjezdy křižovatkou NS a ES. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do S a ze směru E do S. Tím jsme vyřešili všechny možné konflikty, které se mohou v křižovatce vyskytnout při průjezdu z N do S.',
		action: (graph: Graph) => ({ 
			...graph, 
			edges: [...graph.edges, { source: 'NS', target: 'ES' }] 
		}),
	},
	{
		id: 'tut-12',
		description: 'Krok 9: Tvorba hran: Přesuneme se tedy na další průjezd, například NE. Hranu je potřeba vytvořit mezi průjezdy křižovatkou NE a WN. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do E a ze směru W do N.',
		action: (graph: Graph) => ({ 
			...graph, 
			edges: [...graph.edges, { source: 'NE', target: 'WN' }] 
		}),
	},
	{
		id: 'tut-13',
		description: 'Krok 10: Tvorba hran: Další hranu vytvoříme mezi průjezdy křižovatkou NE a ES. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do E a ze směru E do S. Tím jsme opět zakreslili pomocí hran všechny možné konflikty, které mohou vzniknout při průjezdu křižovatkou ze směru N do E.',
		action: (graph: Graph) => ({ 
			...graph, 
			edges: [...graph.edges, { source: 'NE', target: 'ES' }] 
		}),
	},
	{
		id: 'tut-14',
		description: 'Krok 11: Tvorba hran: Přesuneme se tedy na další průjezd, tentokrát například ES. Konflikt může vzniknout například při průjezdu křižovatkou ze směru N do E, ale tuto kolizní hranu jsme již přidali v kroku 10. Další možný konflikt může vzniknout při průjezdu křižovatkou ze smeru S do W. Přidáme tedy hranu mezi vrcholy ES a SW, což je zároveň také poslední možný konflikt, který může vzniknout při průjezdu křižovatkou ze směru E do S.',
		action: (graph: Graph) => ({ 
			...graph, 
			edges: [...graph.edges, { source: 'ES', target: 'SW' }] 
		}),
	},
	{
		id: 'tut-15',
		description: 'Krok 12: Tvorba hran: Opět se tedy přesuneme na další průjezd křižovatkou, a to SW. Průjezd SW může mít konflikty s průjezdy ES, NS a WN, ovšem hrany mezi ES a NS vrchol SW již má. Je proto potřeba přidat pouze jednu hranu, která bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru S do W a ze směru W do N. Tím jsme vyřešili všechny možné konflikty, které se mohou v křižovatce vyskytnout při průjezdu z S do W.',
		action: (graph: Graph) => ({ 
			...graph, 
			edges: [...graph.edges, { source: 'SW', target: 'WN' }] 
		}),
	},
	{
		id: 'tut-16',
		description: 'Krok 13: Tvorba hran: Přesuneme se tedy na další a zároveň také poslední možný průjezd křižovatkou, a to WN. Průjezd WN může vyvolávat kolize s průjezdy SW, NS a NE. Mezi všemi těmito vrcholy má však vrchol WN již doplněné hrany. Graf je tedy kompletní.',
	},
	// TODO: nevím, jestli rovnou dělat ohodnocení nebo prvně obarvit normálně a pak se vrátit k ohodnocení a obarvení (normálnímu + frakcionálnímu)
	{
		id: 'tut-17',
		description: 'V dalším kroku je potřeba přidat grafu ještě jednotlivá ohodnocení jeho vrcholů, která budou znázorňovat intenzitu provozu v daném průjezdu křižovatkou. Také je potřeba přidat ohodnocení hran, které budou znázorňovat pravděpodobnost vzniku kolize mezi jednotlivými průjezdy křižovatkou.',
	},
	{
		id: 'tut-18',
		description: 'Krok 14: Ohodnocení vrcholů: Vrchol NS bude ohodnocen hodnotou 0.9, což znamená, že průjezd křižovatkou má vysokou intenzitu provozu.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'NS' ? { ...v, value: 0.9 } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-19',
		description: 'Krok 15: Ohodnocení vrcholů: Vrchol NE bude ohodnocen hodnotou 0.7, což znamená, že průjezd křižovatkou má vysokou intenzitu provozu.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'NE' ? { ...v, value: 0.7 } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-20',
		description: 'Krok 16: Ohodnocení vrcholů: Vrchol ES bude ohodnocen hodnotou 0.6, což znamená, že průjezd křižovatkou má střední intenzitu provozu.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'ES' ? { ...v, value: 0.6 } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-21',
		description: 'Krok 17: Ohodnocení vrcholů: Vrchol SW bude ohodnocen hodnotou 0.8, což znamená, že průjezd křižovatkou má vysokou intenzitu provozu.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'SW' ? { ...v, value: 0.8 } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-22',
		description: 'Krok 18: Ohodnocení vrcholů: Vrchol WN bude ohodnocen hodnotou 0.7, což znamená, že průjezd křižovatkou má vysokou intenzitu provozu.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'WN' ? { ...v, value: 0.7 } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-23',
		description: 'Krok 19: Ohodnocení hran: Začneme ohodnocením hrany mezi vrcholy NS a ES. Vzhledem k tomu, že se průjezd ES pouze připojuje k NS, tak hrana bude ohodnocena například hodnotou 0.2, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do S a ze směru E do S je velmi nízká.',
		action: (graph: Graph) => {
			const newEdges = graph.edges.map(e =>
				(e.source === 'NS' && e.target === 'ES') ? { ...e, value: 0.2 } : e
			)
			return { ...graph, edges: newEdges }
		},
	},
	{
		id: 'tut-24',
		description: 'Krok 20: Ohodnocení hran: Hrana mezi vrcholy NS a SW se kříží, proto bude ohodnocena hodnotou 0.7, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do S a ze směru S do W je vysoká.',
		action: (graph: Graph) => {
			const newEdges = graph.edges.map(e =>
				(e.source === 'NS' && e.target === 'SW') ? { ...e, value: 0.7 } : e
			)
			return { ...graph, edges: newEdges }
		},
	},
	{
		id: 'tut-25',
		description: 'Krok 21: Ohodnocení hran: Hrana mezi vrcholy NS a WN se kříží, proto bude ohodnocena hodnotou 0.65, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do S a ze směru W do N je vysoká.',
		action: (graph: Graph) => {
			const newEdges = graph.edges.map(e =>
				(e.source === 'NS' && e.target === 'WN') ? { ...e, value: 0.65 } : e
			)
			return { ...graph, edges: newEdges }
		},
	},
	{
		id: 'tut-26',
		description: 'Krok 22: Ohodnocení hran: Hrana mezi vrcholy NE a WN se kříží, proto bude ohodnocena hodnotou 0.65, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do E a ze směru W do N je vysoká.',
		action: (graph: Graph) => {
			const newEdges = graph.edges.map(e =>
				(e.source === 'NE' && e.target === 'WN') ? { ...e, value: 0.65 } : e
			)
			return { ...graph, edges: newEdges }
		},
	},
	{
		id: 'tut-27',
		description: 'Krok 23: Ohodnocení hran: Hrana mezi vrcholy NE a ES se kříží, proto bude ohodnocena hodnotou 0.6, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do E a ze směru E do S je střední.',
		action: (graph: Graph) => {
			const newEdges = graph.edges.map(e =>
				(e.source === 'NE' && e.target === 'ES') ? { ...e, value: 0.6 } : e
			)
			return { ...graph, edges: newEdges }
		},
	},
	{
		id: 'tut-28',
		description: 'Krok 24: Ohodnocení hran: Hrana mezi vrcholy ES a SW se kříží, proto bude ohodnocena hodnotou 0.4, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru E do S a ze směru S do W je střední.',
		action: (graph: Graph) => {
			const newEdges = graph.edges.map(e =>
				(e.source === 'ES' && e.target === 'SW') ? { ...e, value: 0.4 } : e
			)
			return { ...graph, edges: newEdges }
		},
	},
	{
		id: 'tut-29',
		description: 'Krok 25: Ohodnocení hran: Hrana mezi vrcholy SW a WN se kříží, proto bude ohodnocena hodnotou 0.5, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru S do W a ze směru W do N je střední.',
		action: (graph: Graph) => {
			const newEdges = graph.edges.map(e =>
				(e.source === 'SW' && e.target === 'WN') ? { ...e, value: 0.5 } : e
			)
			return { ...graph, edges: newEdges }
		},
	},
	{
		id: 'tut-30',
		description: 'Graf je aktuálně plně ohodnocený, můžeme se tedy přesunout na samotné barvení grafu. Před tím, než se přeci jen přesuneme na barvení grafu, je nutné si zavést pojmy jako slabě sousedící a silně sousedící vrcholy a jejich hrany.',
	},
	{
		id: 'tut-31',
		description: 'Krok 26: Slabě sousedící vrcholy jsou takové vrcholy, které jsou spojeny hranou, avšak ohodnocení této hrany je menší než polovina ohodnocení menšího z vrcholů, ze kterých tato hrana vychází. V tomto grafu je slabě sousedící pouze dvojice NS a ES (pro přehlednost tato hrana bude čárkovaná), protože hrana mezi těmito vrcholy má ohodnocení 0.2, což je menší než polovina ohodnocení vrcholu NS (0.9) a vrcholu ES (0.6). Zbylé hrany již toto kritérium nesplňují, nazveme tyto vrcholy a hrany silně sousedícími.',
		action: (graph: Graph) => {
			const newEdges = graph.edges.map(e =>
				(e.source === 'NS' && e.target === 'ES') ? 
				{ ...e, type: 'weak' as const } : e
			)
			return { ...graph, edges: newEdges }
		},
	},
	{
		id: 'tut-32',
		description: 'Samotné určení slabě sousedících vrcholů a hran je pro barvení grafu zcela zásadní, protože tyto hrany a vrcholy se před barvením grafu dočasně odstraní a následně můžeme přistoupit k barvení vrcholů. Barvení vrcholů je založeno na principu, že žádné dva sousedící vrcholy nesmí mít stejnou barvu.',
		action: (graph: Graph) => ({
			...graph,
			edges: graph.edges.filter(e => 
				!(e.source === 'NS' && e.target === 'ES') && 
				!(e.source === 'ES' && e.target === 'NS')
			)
		}),
	},
	{
		id: 'tut-33',
		description: 'Krok 27: Barvení vrcholů: Po odstranění slabě sousedící hrany je možné graf začít barvit, začneme u vrcholu NS, pro který je možné zvolit libovolnou barvu. Vybereme tedy například červenou barvu.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'NS' ? { ...v, color: 'red' } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-34',
		description: 'Krok 28: Barvení vrcholů: Další v pořadí je vrchol NE, tento vrchol nesousedí s vrcholem NS, proto můžeme opět zvolit libovolnou barvu. Protože se snažíme graf ideálně obarvit co nejmenším počtem barev, obarvíme ho znovu červenou barvou.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'NE' ? { ...v, color: 'red' } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-35',
		description: 'Krok 29: Barvení vrcholů: Přesuneme se na vrchol ES. Tento vrchol sousedí s vrcholem NE, který je již obarven červeně, proto musíme zvolit jinou barvu. Vybereme tedy zelenou barvu.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'ES' ? { ...v, color: 'green' } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-36',
		description: 'Krok 30: Barvení vrcholů: Vrchol SW sousedí jak s vrcholem ES, tak s vrcholem NS, které jsou již obarveny. Proto musíme zvolit jinou barvu (libovolnou mimo červenou a zelenou). Vybereme tedy modrou barvu.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'SW' ? { ...v, color: 'blue' } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-37',
		description: 'Krok 31: Barvení vrcholů: Poslední v pořadí je vrchol WN, ten sousedí s vrcholy SW (modrý), NE a NS (červené), proto tedy musíme zvolit jinou barvu (libovolnou mimo modrou a červenou), opět se snažíme zvolit takovou barvu, aby počet barev na obarvení grafu byl nejmenší. Volíme tedy pro vrchol WN barvu zelenou.',
		action: (graph: Graph) => {
			const newVertices = graph.vertices.map(v =>
				v.id === 'WN' ? { ...v, color: 'green' } : v
			)
			return { ...graph, vertices: newVertices }
		},
	},
	{
		id: 'tut-38',
		description: 'Krok 32: Grafu můžeme opět přidat slabě sousedící vrcholy a hrany, které jsme před barvením grafu odstranili. Takový graf je tedy kompletně obarvený. Tento graf lze obarvit minimálně 3 barvami, jeho chromatické číslo (což značí právě minimální počet barev potřebný k obarvení grafu) je tedy 3.',	
		action: (graph: Graph) => ({
			...graph,
			edges: [...graph.edges, { source: 'NS', target: 'ES', type: 'weak' }]
		}),
	},
	{
		id: 'tut-39',
		description: 'K čemu nám vůbec takové obarvení je? Samotné barvy znázorňují, jaké průjezdy křižovatkou mohou být provozovány souběžně, aniž by se navzájem ovlivňovaly. V tomto případě tedy můžeme provozovat průjezdy křižovatkou NS a NE souběžně, stejně tak průjezdy křižovatkou ES a WN, a nakonec průjezdy křižovatkou SW samostatně. Tímto se nám podařilo zefektivnit průjezd křižovatkou a zároveň snížit riziko vzniku kolizí mezi jednotlivými průjezdy křižovatkou.',
	},
	{
		id: 'tut-40',
		description: 'Tímto se nám podařilo nastínit proces, jakým schéma křižovatky převést na graf a následně tento graf obarvit. Tento styl barvení však není jedinou možností, jak graf obarvit. Existují i další možnosti, my se dále zaměříme na barvení grafu pomocí frakcionálního barvení, pomocí kterého jde v některých případech snížit počet barev potřebných k zabarvení grafu a tím tedy průjezd samotnou křižovatkou zefektivnit.',
	},
	{
		id: 'tut-41',
		description: 'Prvních pár kroků probíhá totožně jako u předchozí varianty barvení grafu. Po vytvoření grafu a určení slabě sousedících vrcholů a hran, které dočasně odstraníme se přesuneme k samotnému barvení grafu. Dále se však postup lehce liší. Je potřeba nejprve určit nezávislé množiny mezi silně sousedícími vrcholy, tedy mezi těmi, které v grafu zůstaly a každé takové nezávislé množině přidělit jednu barvu.',
	},
	{
		id: 'tut-42',
		description: 'Reset grafu: Odstraníme aktuální barvy vrcholů a hran a odstraníme slabou hranu mezi ES a NS pro názornost.',
		action: (graph: Graph) => {
			// Vrátíme každému vrcholu neobarvený stav (odstraníme vlastnost color)
			const resetVertices = graph.vertices.map(v => {
				const { color, ...rest } = v;  // odstraníme color
				return rest;
			});
			// Odstraníme barvy u hran a specificky i hranu mezi ES a NS (v obou směrech)
			const resetEdges = graph.edges
				.filter(e => !( (e.source === 'ES' && e.target === 'NS') || (e.source === 'NS' && e.target === 'ES') ))
				.map(e => {
					const { color, ...rest } = e;
					return rest;
				});
			return { ...graph, vertices: resetVertices, edges: resetEdges };
		},
	},
	{ // TODO: možná by stálo za to ty kroky nějak odlišit, jestli normální barvení nebo frakcionální, například krok 44a/44b?
		id: 'tut-43', // TODO: zkontrolovat pořádně, nevím, jestli je to aktuálně správně
		description: 'Krok 33: Nezávislé množiny: Určíme tedy nezávislé množiny (vrcholy, které nejsou mezi sebou přímo spojené hranou), S1 = {NS, NE}, S2 = {NS, ES}, S3 = {NE, SW}, S4 = {ES, WN}. Každé takové nezávislé množině přidělíme jednu barvu. Zvolíme například červenou pro S1, zelenou pro S2, modrou pro S3 a fialovou pro S4.',
	},
	{
		id: 'tut-44',
		description: 'V dalším kroku je potřeba přiřadit každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně pokryt, tedy aby součet těchto zlomků u každého z vrcholů byl alespoň 1. Tento krok lze řešit jako úlohu lineárního programování, kde budeme minimalizovat počet barev, které jsou potřeba k obarvení grafu frakcionálně. Konkrétně budeme používat simplexovou metodu, která je podrobně vysvětlena v (odkaz na Patrikovu bakalářku)', // TODO: doplnit odkaz na Patrikovu bakalářku
	},
	{
		id: 'tut-44',
		description: 'Po této optimalizaci, tedy odstranění barev, které pro optimální řešení nejsou potřeba graf opět obarvíme. Výsledný graf bude obarven minimálním počtem barev, které jsou potřeba k obarvení grafu frakcionálně. Z výsledků simplexové metody lze určit, že minimální počet barev potřebných k obarvení grafu je 2.5, oproti normálnímu barvení, kde bylo potřeba využít 3 barvy.',
	},
	{
		id: 'tut-45',
		description: 'Na základě simplexové metody bude frakcionálně obarven vrchol NE. Tento vrchol bude z poloviny obarvený červeně a z poloviny modře, což reprezentuje jeho podíl v nezávislých množinách S1 a S3. Ostatní vrcholy zůstanou obarveny podobně jako v původním klasicky obarveném grafu - NS červeně, ES a WN zeleně, a SW modře.',
		action: (graph: Graph) => {
			// Nejprve resetujeme barvy vrcholů pro jistotu
			const resetVertices = graph.vertices.map(v => {
				const { color, ...rest } = v;
				return rest;
			});
			
			// Pak přiřadíme barvy podle zadání
			const coloredVertices = resetVertices.map(v => {
				switch(v.id) {
					case 'NS': 
						return { ...v, color: 'red' };
					case 'NE': 
						// Pro NE použijeme "rozdělené" obarvení pomocí CSS gradientu
						return { ...v, color: 'linear-gradient(90deg, red 50%, blue 50%)' };
					case 'ES':
						return { ...v, color: 'green' };
					case 'SW':
						return { ...v, color: 'blue' };
					case 'WN':
						return { ...v, color: 'green' };
					default:
						return v;
				}
			});
			
			return { ...graph, vertices: coloredVertices };
		}
	},
	{
		id: 'tut-46',
		description: 'Na závěr přidáme zpět slabou hranu mezi NS a ES, která byla dočasně odstraněna pro účely barvení. Takto obarvený graf reprezentuje frakcionální řešení s chromatickým číslem 2.5, což je méně než chromatické číslo 3 získané klasickým barvením.',
		action: (graph: Graph) => ({
			...graph,
			edges: [...graph.edges, { source: 'NS', target: 'ES', type: 'weak' }]
		}),
	},
	{
		id: 'tut-47',
		description: 'Tímto jsme dokončili tvorbu grafu a jeho barvení na základě schématu křižovatky. V případě, že byste chtěli vytvořit graf na základě jiného schématu křižovatky, můžete si vybrat z několika předpřipravených schémat, které jsou zobrazeny níže.',
	}
]

export default function TutorialPage() {
  const [graph, setGraph] = useState<Graph>({ vertices: [], edges: [] })
	const navigate = useNavigate()

	const handleTypeSelect = (type: 'T' | 'X') => {
    navigate(`/select-scheme/${type}`)
  }

  const handleStepChange = useCallback((stepIndex: number) => {
    // Znovuvytvoříme graf od začátku až do aktuálního kroku
    let newGraph: Graph = { vertices: [], edges: [] }
    for (let i = 0; i <= stepIndex; i++) {
      const step = tutorialSteps[i]
      if (step.action) {
        newGraph = step.action(newGraph)
      }
    }
    setGraph(newGraph)
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tutoriál
      </Typography>
      <Typography variant="body1" gutterBottom>
        Tento tutoriál vás provede tvorbou grafu na základě schématu křižovatky. V pravé části můžete sledovat aktuální podobu grafu.
      </Typography>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Původní schéma křižovatky:
        </Typography>
        <img
          src="src/imgs/tutorial_scheme.jpg"
          alt="Původní schéma křižovatky"
          style={{ width: '300px' }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Wizard steps={tutorialSteps} onStepChange={handleStepChange} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 300, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Vizualizace grafu
          </Typography>
          <IntersectionGraph graph={graph} />
        </Box>
      </Box>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Příklady schémat křižovatky:
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => handleTypeSelect('T')}
          sx={{ flexDirection: 'column', p: 2, mr: 2 }}
        >
          <img
            src="src/imgs/T-type.jpg"
            alt="Schéma křižovatky typu T"
            style={{ width: '200px' }}
          />
          <Typography variant="button" sx={{mt: 1}}>Typ T</Typography>
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => handleTypeSelect('X')}
          sx={{ flexDirection: 'column', p: 2 }}
        >
          <img
            src="src/imgs/X-type.jpg"
            alt="Schéma křižovatky typu X"
            style={{ width: '200px' }}
          />
          <Typography variant="button" sx={{mt: 1}}>Typ X</Typography>
        </Button>
      </Box>
    </Box>
  )
}