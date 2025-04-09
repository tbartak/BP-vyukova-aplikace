import { useState, useCallback, useContext, useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'
import Wizard from '../components/GraphWizard/Wizard'
import IntersectionGraph from '../components/IntersectionGraph'
import { Graph, Step } from '../config/variants'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import BreadcrumbsNav from '../components/BreadcrumbsNav'
import { createSteps } from '../config/scheme_utils'
import EdgeList from '../components/EdgeList'

const tutorialSteps: Step[] = [
	...createSteps('tut', [
		{
			text: 'Úvod: Představení základních pojmů a informací. Pro jednoduchost jsou jednotlivé cesty křižovatky označeny světovými stranami (N - sever, E - východ, S - jih, W - západ). Každá křižovatka se dá převést na graf, kde vrcholy představují jednotlivé průjezdy křižovatkou a hrany znázorňují možné konflikty mezi těmito průjezdy. Podrobně si to ukážeme v následujících krocích.',
			noNumber: true
		},
		{
			text: 'Následující kroky budou zaměřeny na vytvoření vrcholů ze schématu křižovatky. V pravé části obrazovky je zobrazený samotný graf, který bude postupně vytvářen.',
			noNumber: true
		},
		{
			text: 'Tvorba vrcholů: Začneme průjezdy křižovatkou ze směru N (sever), kde existuje například průjezd NS (neboli průjezd křižovatkou z N do S). Přidáme tedy vrchol, který nazveme NS.',
			action: (graph: Graph) => ({ 
					...graph, 
					vertices: [...graph.vertices, { id: 'NS' }] 
			}),
		},
		{
			text: 'Tvorba vrcholů: Podobným způsobem jako v předešlém kroku můžeme přidat taktéž průjezd křižovatkou ze směru N do E. Přidáme tedy nový vrchol pod názvem NE.',
			action: (graph: Graph) => ({ 
					...graph, 
					vertices: [...graph.vertices, { id: 'NE' }] 
			}),
		},
		{
			text: 'Tvorba vrcholů: Přesuneme se k průjezdům křižovatkou ze směru E (východ). Z tohoto směru má křižovatka jediný možný průjezd a to do S. Přidáme tedy vrchol ES.',
			action: (graph: Graph) => ({ 
					...graph, 
					vertices: [...graph.vertices, { id: 'ES' }] 
			}),
		},
		{
			text: 'Tvorba vrcholů: Další v pořadí jsou průjezdy křižovatkou ze směru S (jih). Z tohoto směru také pouze jeden možný průjezd křižovatkou, a to do W. Přidáme tedy vrchol SW.',
			action: (graph: Graph) => ({ 
					...graph, 
					vertices: [...graph.vertices, { id: 'SW' }] 
			}),
		},
		{
			text: 'Tvorba vrcholů: Jako poslední zbývá průjezd křižovatkou ze směru W (západ). Z tohoto směru máme opět pouze jeden možný průjezd křižovatkou, a to do N. Přidáme tedy vrchol WN.',
			action: (graph: Graph) => ({ 
					...graph, 
					vertices: [...graph.vertices, { id: 'WN' }] 
			}),
		},
		{
			text: 'Po vytvoření všech vrcholů můžeme pokračovat v tvorbě hran. V dalších krocích se zaměříme na propojení jednotlivých průjezdů křižovatkou na základě možných konfliktů mezi nimi.',
			noNumber: true
		},
		{
			text: 'Tvorba hran: První hranu vytvoříme mezi průjezdy křižovatkou NS a SW. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do S a ze směru S do W.',
			action: (graph: Graph) => ({ 
				...graph, 
				edges: [...graph.edges, { source: 'NS', target: 'SW' }] 
			}),
		},
		{
			text: 'Tvorba hran: Další hranu vytvoříme mezi průjezdy křižovatkou NS a WN. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do S a ze směru W do N.',
			action: (graph: Graph) => ({ 
				...graph, 
				edges: [...graph.edges, { source: 'NS', target: 'WN' }] 
			}),
		},
		{
			text: 'Tvorba hran: Další hranu vytvoříme mezi průjezdy křižovatkou NS a ES. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do S a ze směru E do S. Tím jsme vyřešili všechny možné konflikty, které se mohou v křižovatce vyskytnout při průjezdu z N do S.',
			action: (graph: Graph) => ({ 
				...graph, 
				edges: [...graph.edges, { source: 'NS', target: 'ES' }] 
			}),
		},
		{
			text: 'Tvorba hran: Přesuneme se tedy na další průjezd, například NE. Hranu je potřeba vytvořit mezi průjezdy křižovatkou NE a WN. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do E a ze směru W do N.',
			action: (graph: Graph) => ({ 
				...graph, 
				edges: [...graph.edges, { source: 'NE', target: 'WN' }] 
			}),
		},
		{
			text: 'Tvorba hran: Další hranu vytvoříme mezi průjezdy křižovatkou NE a ES. Tato hrana bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru N do E a ze směru E do S. Tím jsme opět zakreslili pomocí hran všechny možné konflikty, které mohou vzniknout při průjezdu křižovatkou ze směru N do E.',
			action: (graph: Graph) => ({ 
				...graph, 
				edges: [...graph.edges, { source: 'NE', target: 'ES' }] 
			}),
		},
		{
			text: 'Tvorba hran: Přesuneme se tedy na další průjezd, tentokrát například ES. Konflikt může vzniknout například při průjezdu křižovatkou ze směru N do E, ale tuto kolizní hranu jsme již přidali v kroku 10. Další možný konflikt může vzniknout při průjezdu křižovatkou ze smeru S do W. Přidáme tedy hranu mezi vrcholy ES a SW, což je zároveň také poslední možný konflikt, který může vzniknout při průjezdu křižovatkou ze směru E do S.',
			action: (graph: Graph) => ({ 
				...graph, 
				edges: [...graph.edges, { source: 'ES', target: 'SW' }] 
			}),
		},
		{
			text: 'Tvorba hran: Opět se tedy přesuneme na další průjezd křižovatkou, a to SW. Průjezd SW může mít konflikty s průjezdy ES, NS a WN, ovšem hrany mezi ES a NS vrchol SW již má. Je proto potřeba přidat pouze jednu hranu, která bude reprezentovat možný konflikt mezi průjezdy křižovatkou ze směru S do W a ze směru W do N. Tím jsme vyřešili všechny možné konflikty, které se mohou v křižovatce vyskytnout při průjezdu z S do W.',
			action: (graph: Graph) => ({ 
				...graph, 
				edges: [...graph.edges, { source: 'SW', target: 'WN' }] 
			}),
		},
		{
			text: 'Tvorba hran: Přesuneme se tedy na další a zároveň také poslední možný průjezd křižovatkou, a to WN. Průjezd WN může vyvolávat kolize s průjezdy SW, NS a NE. Mezi všemi těmito vrcholy má však vrchol WN již doplněné hrany. Graf je tedy kompletní.',
		},
		{
			text: 'V dalším kroku je potřeba přidat grafu ještě jednotlivá ohodnocení jeho vrcholů, která budou znázorňovat intenzitu provozu v daném průjezdu křižovatkou. Také je potřeba přidat ohodnocení hran, které budou znázorňovat pravděpodobnost vzniku kolize mezi jednotlivými průjezdy křižovatkou.',
			noNumber: true
		},
		{
			text: 'Ohodnocení vrcholů: Vrchol NS bude ohodnocen hodnotou 0.9, což znamená, že průjezd křižovatkou má vysokou intenzitu provozu.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, value: 0.9 } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Ohodnocení vrcholů: Vrchol NE bude ohodnocen hodnotou 0.7, což znamená, že průjezd křižovatkou má vysokou intenzitu provozu.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, value: 0.7 } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Ohodnocení vrcholů: Vrchol ES bude ohodnocen hodnotou 0.6, což znamená, že průjezd křižovatkou má střední intenzitu provozu.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, value: 0.6 } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Ohodnocení vrcholů: Vrchol SW bude ohodnocen hodnotou 0.8, což znamená, že průjezd křižovatkou má vysokou intenzitu provozu.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, value: 0.8 } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Ohodnocení vrcholů: Vrchol WN bude ohodnocen hodnotou 0.7, což znamená, že průjezd křižovatkou má vysokou intenzitu provozu.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, value: 0.7 } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Ohodnocení hran: Začneme ohodnocením hrany mezi vrcholy NS a SW. Tyto průjezdy se kříží, proto bude ohodnocena hodnotou 0.7, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do S a ze směru S do W je vysoká.',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'NS' && e.target === 'SW') ? { ...e, value: 0.7 } : e
				)
				return { ...graph, edges: newEdges }
			},
		},
		{
			text: 'Ohodnocení hran: Průjezd mezi NS a WN se kříží, proto bude hrana ohodnocena hodnotou 0.65, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do S a ze směru W do N je vysoká.',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'NS' && e.target === 'WN') ? { ...e, value: 0.65 } : e
				)
				return { ...graph, edges: newEdges }
			},
		},
		{
			text: 'Ohodnocení hran: Hrana mezi vrcholy NS a ES, vzhledem k tomu, že se průjezd ES pouze připojuje k NS, tak hrana bude ohodnocena například hodnotou 0.2, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do S a ze směru E do S je velmi nízká.',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'NS' && e.target === 'ES') ? { ...e, value: 0.2 } : e
				)
				return { ...graph, edges: newEdges }
			},
		},
		{
			text: 'Ohodnocení hran: Průjezd mezi NE a WN se kříží, proto bude hrana ohodnocena hodnotou 0.65, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do E a ze směru W do N je vysoká.',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'NE' && e.target === 'WN') ? { ...e, value: 0.65 } : e
				)
				return { ...graph, edges: newEdges }
			},
		},
		{
			text: 'Ohodnocení hran: Průjezd mezi NE a ES se kříží, proto bude hrana ohodnocena hodnotou 0.5, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru N do E a ze směru E do S je střední.',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'NE' && e.target === 'ES') ? { ...e, value: 0.5 } : e
				)
				return { ...graph, edges: newEdges }
			},
		},
		{
			text: 'Ohodnocení hran: Průjezd mezi ES a SW se kříží, proto bude hrana ohodnocena hodnotou 0.4, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru E do S a ze směru S do W je střední.',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'ES' && e.target === 'SW') ? { ...e, value: 0.4 } : e
				)
				return { ...graph, edges: newEdges }
			},
		},
		{
			text: 'Ohodnocení hran: Průjezd mezi SW a WN se kříží, proto bude hrana ohodnocena hodnotou 0.3, což znamená, že pravděpodobnost vzniku kolize mezi průjezdy křižovatkou ze směru S do W a ze směru W do N je nízká.',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'SW' && e.target === 'WN') ? { ...e, value: 0.3 } : e
				)
				return { ...graph, edges: newEdges }
			},
		},
		{
			text: 'Graf je aktuálně plně ohodnocený, můžeme se tedy přesunout na samotné barvení grafu. Před tím, než se přeci jen přesuneme na barvení grafu, je nutné si zavést pojmy jako slabě sousedící a silně sousedící vrcholy a jejich hrany.',
			noNumber: true
		},
		{
			text: 'Slabě sousedící vrcholy jsou takové vrcholy, které jsou spojeny hranou, avšak ohodnocení této hrany je menší než polovina ohodnocení menšího z vrcholů, ze kterých tato hrana vychází. V tomto grafu je slabě sousedící dvojice NS a ES a také SW a WN (pro přehlednost tyto hrany jsou čárkované), protože hrana mezi těmito vrcholy má ohodnocení 0.2, což je menší než polovina ohodnocení vrcholu NS (0.9) a vrcholu ES (0.6).',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'NS' && e.target === 'ES') ? 
					{ ...e, type: 'weak' as const } : e
				)
				return { ...graph, edges: newEdges }
			},
		},
		{
			text: 'Podobně je tomu tak mezi vrcholy SW (0.8) a WN (0.7), kde hodnota hrany je pouze 0.3, což je menší než polovina ohodnocení menšího z vrcholů (0.7).',
			action: (graph: Graph) => {
				const newEdges = graph.edges.map(e =>
					(e.source === 'SW' && e.target === 'WN') ? 
					{ ...e, type: 'weak' as const } : e
				)
				return { ...graph, edges: newEdges } 
			},
		},
		{
			text: 'Samotné určení slabě sousedících vrcholů a hran je pro barvení grafu zcela zásadní, protože tyto hrany a vrcholy se před barvením grafu dočasně odstraní a následně můžeme přistoupit k barvení vrcholů. Barvení vrcholů je založeno na principu, že žádné dva sousedící vrcholy nesmí mít stejnou barvu.',
			noNumber: true,
			action: (graph: Graph) => ({
				...graph,
				edges: graph.edges.filter(e => 
					!(e.source === 'NS' && e.target === 'ES') && 
					!(e.source === 'ES' && e.target === 'NS') &&
					!(e.source === 'SW' && e.target === 'WN') &&
					!(e.source === 'WN' && e.target === 'SW')
				)
			}),
		},
		{
			text: 'Barvení vrcholů: Po odstranění slabě sousedících hran je možné graf začít barvit, začneme u vrcholu NS, pro který je možné zvolit libovolnou barvu. Vybereme tedy například červenou barvu.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Barvení vrcholů: Další v pořadí je vrchol NE, tento vrchol nesousedí s vrcholem NS, proto můžeme opět zvolit libovolnou barvu. Protože se snažíme graf ideálně obarvit co nejmenším počtem barev, obarvíme ho znovu červenou barvou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: 'red' } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Barvení vrcholů: Přesuneme se na vrchol ES. Tento vrchol sousedí s vrcholem NE, který je již obarven červeně, proto musíme zvolit jinou barvu. Vybereme tedy zelenou barvu.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Barvení vrcholů: Vrchol SW sousedí jak s vrcholem ES, tak s vrcholem NS, které jsou již obarveny. Proto musíme zvolit jinou barvu (libovolnou mimo červenou a zelenou). Vybereme tedy modrou barvu.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: 'cyan' } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Barvení vrcholů: Poslední v pořadí je vrchol WN, ten sousedí s vrcholy NE a NS (červené), proto tedy musíme zvolit jinou barvu (libovolnou mimo červenou), opět se snažíme zvolit takovou barvu, aby počet barev na obarvení grafu byl nejmenší. Volíme tedy pro vrchol WN barvu zelenou.',
			action: (graph: Graph) => {
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: 'yellowgreen' } : v
				)
				return { ...graph, vertices: newVertices }
			},
		},
		{
			text: 'Grafu můžeme opět přidat slabě sousedící vrcholy a hrany, které jsme před barvením grafu odstranili. Takový graf je tedy kompletně obarvený. Tento graf lze obarvit minimálně 3 barvami, jeho chromatické číslo (což značí právě minimální počet barev potřebný k obarvení grafu) je tedy 3.',	
			action: (graph: Graph) => ({
				...graph,
				edges: [
					...graph.edges, 
					{ source: 'NS', target: 'ES', type: 'weak', value: 0.2 }, 
					{ source: 'SW', target: 'WN', type: 'weak', value: 0.3 }
				]
			}),
		},
		{
			text: 'K čemu nám vůbec takové obarvení je? Samotné barvy znázorňují, jaké průjezdy křižovatkou mohou být provozovány souběžně, aniž by se navzájem ovlivňovaly. V tomto případě tedy můžeme provozovat průjezdy křižovatkou NS a NE souběžně, stejně tak průjezdy křižovatkou ES a WN, a nakonec průjezdy křižovatkou SW samostatně. Tímto se nám podařilo zefektivnit průjezd křižovatkou a zároveň snížit riziko vzniku kolizí mezi jednotlivými průjezdy křižovatkou.',
			noNumber: true
		},
		{
			text: 'Tímto se nám podařilo nastínit proces, jakým schéma křižovatky převést na graf a následně tento graf obarvit. Tento styl barvení však není jedinou možností, jak graf obarvit. Existují i další možnosti, my se dále zaměříme na barvení grafu pomocí frakcionálního barvení, pomocí kterého jde v některých případech snížit počet barev potřebných k zabarvení grafu a tím tedy průjezd samotnou křižovatkou zefektivnit.',
			noNumber: true
		},
		{
			text: 'Prvních pár kroků probíhá totožně jako u předchozí varianty barvení grafu. Po vytvoření grafu a určení slabě sousedících vrcholů a hran, které dočasně odstraníme se přesuneme k samotnému barvení grafu. Dále se však postup lehce liší. Je potřeba nejprve určit nezávislé množiny mezi silně sousedícími vrcholy, tedy mezi těmi, které v grafu zůstaly a každé takové nezávislé množině přidělit jednu barvu.',
			noNumber: true
		},
		{
			text: 'Reset grafu: Odstraníme aktuální barvy vrcholů a hran a odstraníme slabou hranu mezi ES a NS a také hranu mezi SW a WN pro názornost.',
			noNumber: true,
			action: (graph: Graph) => {
				// Odstranění barvy všech vrcholů
				const resetVertices = graph.vertices.map(v => {
					const { color, ...rest } = v;
					return rest;
				});
				// Odstranění hrany mezi ES a NS a také SW a WN (v obou směrech)
				const resetEdges = graph.edges
					.filter(e => !( (e.source === 'ES' && e.target === 'NS') || (e.source === 'NS' && e.target === 'ES') || (e.source === 'SW' && e.target === 'WN') || (e.source === 'WN' && e.target === 'SW') ))
					.map(e => {
						const { color, ...rest } = e;
						return rest;
					});
				return { ...graph, vertices: resetVertices, edges: resetEdges };
			},
		},
		{ // TODO: možná by stálo za to ty kroky nějak odlišit, jestli normální barvení nebo frakcionální, například krok 44a/44b?
			text: 'Nezávislé množiny: Určíme tedy nezávislé množiny mezi silně sousedícími vrcholy (vrcholy, které nejsou mezi sebou přímo spojené hranou), S1 = {NS, NE}, S2 = {NS, ES}, S3 = {NE, SW}, S4 = {ES, WN}, S5 = {SW, WN}. Každé takové nezávislé množině přidělíme jednu barvu. Zvolíme například červenou pro S1, zelenou pro S2, modrou pro S3, žlutou pro S4 a fialovou pro S5.',
		},
		{
			text: 'V dalším kroku je potřeba přiřadit každé nezávislé množině zlomek tak, aby každý vrchol byl dostatečně pokryt, tedy aby součet těchto zlomků u každého z vrcholů byl alespoň 1. Tento krok lze řešit jako úlohu lineárního programování, kde budeme minimalizovat počet barev, které jsou potřeba k obarvení grafu frakcionálně. Konkrétně budeme používat simplexovou metodu, která je podrobně vysvětlena v: http://patrikes.explonetwork.eu/learn/linear',
			noNumber: true
		},
		{
			text: 'Po této optimalizaci, tedy odstranění barev/nezávislých množin, které pro optimální řešení nejsou potřeba graf opět obarvíme. Výsledný graf bude obarven minimálním počtem barev, které jsou potřeba k obarvení grafu frakcionálně. Z výsledků simplexové metody lze určit, že minimální počet barev potřebných k obarvení grafu je 2, oproti normálnímu barvení, kde bylo potřeba využít 3 barvy. ',
			noNumber: true
		},
		{
			text: 'Na základě nezávislých množin bude frakcionálně obarven vrchol NS barvou, která je přiřazená množině S1 a S2, tedy červená a zelená. Tento vrchol bude tedy z poloviny obarvený červeně a z poloviny zeleně, což reprezentuje jeho podíl v nezávislých množinách S1 a S2.',
			action: (graph: Graph) => {				
				const newVertices = graph.vertices.map(v =>
					v.id === 'NS' ? { ...v, color: { type: 'gradient', colors: ['red', 'yellowgreen'] } } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Podobným způsobem jsme schopni obarvit také zbylé vrcholy, například vrchol NE patří do nezávislých množin S1 a S3, které mají přiřazeny červenou a modrou barvu. Obarvíme tento vrchol tedy frakcionálně červenou a modrou barvou.',
			action: (graph: Graph) => {				
				const newVertices = graph.vertices.map(v =>
					v.id === 'NE' ? { ...v, color: { type: 'gradient', colors: ['red', 'cyan'] } } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Dále vrchol ES patří do nezávislých množin S2 a S4, které mají přiřazeny zelenou a žlutou barvu. Obarvíme tento vrchol tedy frakcionálně zelenou a žlutou barvou.',
			action: (graph: Graph) => {				
				const newVertices = graph.vertices.map(v =>
					v.id === 'ES' ? { ...v, color: { type: 'gradient', colors: ['yellowgreen', 'yellow'] } } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Dále vrchol SW patří do nezávislých množin S3 a S5, které mají přiřazeny modrou a fialovou barvu. Obarvíme tento vrchol tedy frakcionálně modrou a fialovou barvou.',
			action: (graph: Graph) => {				
				const newVertices = graph.vertices.map(v =>
					v.id === 'SW' ? { ...v, color: { type: 'gradient', colors: ['cyan', 'mediumpurple'] } } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Nakonec vrchol WN patří do nezávislých množin S4 a S5, které mají přiřazeny žlutou a fialovou barvu. Obarvíme tento vrchol tedy frakcionálně žlutou a fialovou barvou.',
			action: (graph: Graph) => {				
				const newVertices = graph.vertices.map(v =>
					v.id === 'WN' ? { ...v, color: { type: 'gradient', colors: ['yellow', 'mediumpurple'] } } : v
				)
				return { ...graph, vertices: newVertices }
			}
		},
		{
			text: 'Na závěr přidáme zpět slabé hrany mezi NS a ES a také mezi SW a WN, které byly dočasně odstraněny pro účely barvení. Takto obarvený graf reprezentuje frakcionální řešení s chromatickým číslem 2, což je méně než chromatické číslo 3 získané klasickým barvením.',
			noNumber: true,
			action: (graph: Graph) => ({
				...graph,
				edges: [
					...graph.edges, 
					{ source: 'NS', target: 'ES', type: 'weak', value: 0.2 },
					{ source: 'SW', target: 'WN', type: 'weak', value: 0.3 }
				]
			}),
		},
		{
			text: 'Tímto jsme dokončili tvorbu grafu a jeho barvení na základě schématu křižovatky. V případě, že byste chtěli vytvořit graf na základě jiného schématu křižovatky, můžete si vybrat z několika předpřipravených schémat, které si lze vybrat kliknutím na tlačítko "Vyberte křižovatku" na domovské obrazovce.',
			noNumber: true
		}])
];

export default function TutorialPage() {
  const [graph, setGraph] = useState<Graph>({ vertices: [], edges: [] })
	const navigate = useNavigate()
	const { setSelectedType, setSelectedScheme, setSelectedVariant } = useContext(AppContext);
	const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);	

	// Handler pro změnu zvýrazněné hrany
	const handleEdgeHover = useCallback((edgeId: string | null) => {
		setHoveredEdgeId(edgeId);
	}, []);

	// Reset při načtení tutoriálu // TODO: teoreticky by nemuselo být potřeba, protože se vždy musí na tutoriál přes home, kde se to zresetuje, ale kdyby někdo šel přes odkaz, tak je to asi vhodné
  useEffect(() => {
    setSelectedType(null);
    setSelectedScheme(null);
    setSelectedVariant(null);
  }, [setSelectedType, setSelectedScheme, setSelectedVariant]);

	const handleTypeSelect = (type: 'T' | 'X') => {
    navigate(`/select-scheme/${type}`)
  }

	// Funkce, která přepočítá graf
  const recalcGraph = (stepIndex: number): Graph => {
    let newGraph: Graph = { vertices: [], edges: [] }
    for (let i = 0; i <= stepIndex; i++) {
      const step = tutorialSteps[i]
      if (step.action) {
        newGraph = step.action(newGraph)
      }
    }
    return newGraph
  }

  const handleStepChange = useCallback((stepIndex: number) => {
    const newGraph = recalcGraph(stepIndex)
    setGraph(newGraph)
  }, [])

  return (
    <Box sx={{ p: 3 }}>
			<BreadcrumbsNav />
      <Typography variant="h4" gutterBottom>
        Tutoriál
      </Typography>
      <Typography variant="body1" gutterBottom>
				Tento tutoriál slouží k seznámení se s tvorbou grafů ze schématu křižovatky. Aktuální podobu grafu lze sledovat v pravé části.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
				{/* Křižovatka */}
				<Box sx={{ width: '400px', textAlign: 'center' }}>
					<Typography variant="h6" gutterBottom>
						Původní schéma křižovatky:
					</Typography>
					<img
						src="/imgs/tutorial_scheme.png"
						alt="Původní schéma křižovatky"
						style={{ width: '400px' }}
					/>
				</Box>
				{/* Vizualizace společně se seznamem hran */}
				<Box sx={{ display: 'flex', flexDirection: 'row', gap: 0, width: '575px' }}>
					{/* Vizualizace grafu */}
					<Box sx={{ width: '400px', textAlign: 'center' }}>					
						<Typography variant="h6" gutterBottom>
							Vizualizace grafu
						</Typography>
						<IntersectionGraph 
							graph={graph} 
							hoveredEdgeId={hoveredEdgeId}
							onEdgeHover={handleEdgeHover}	
						/>
					</Box>
					{/* Seznam hran */}
					<Box sx={{ width: '175px', textAlign: 'center' }}>
						<Typography variant="h6" gutterBottom>
							Seznam hran:
						</Typography>
						<EdgeList 
							graph={graph} 
							hoveredEdgeId={hoveredEdgeId}
							onEdgeHover={handleEdgeHover}
						/>
					</Box>
				</Box>
      </Box>
			<Box sx={{
				width: '100%',
				maxWidth: '975px',
				mx: 'auto',
				mt: 2
			}}>
				<Wizard
					steps={tutorialSteps}
					onStepChange={handleStepChange}
				/>
			</Box>
    </Box>
  )
}