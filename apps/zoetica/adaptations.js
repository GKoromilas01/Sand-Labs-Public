/* Player-only strategy tradeoffs. No timers, rewards or provider calls. */
(function(root){'use strict';
const COST=12;
const paths={balanced:{name:'Balanced',description:'Keep your body-part statistics unchanged. A flexible starting point.'},scout:{name:'Scout',description:'Speed +18%, sight +15%. Health −10% and armour −0.08. Find food and escape; avoid trading blows.'},guardian:{name:'Guardian',description:'Health +20%, armour +0.08 (maximum 0.68). Speed −12%. Survive contact, but plan your escape.'},hunter:{name:'Hunter',description:'Existing attacks +25%, sight +10%. Speed −8%. Needs an attacking body part or mouth; does not grant a bite.'}};
function apply(stats,focus,isPlayer){const s={...stats};if(!isPlayer)return s;if(focus==='scout'){s.speed*=1.18;s.vision*=1.15;s.maxHp*=.9;s.armour=Math.max(0,s.armour-.08);}else if(focus==='guardian'){s.maxHp*=1.2;s.armour=Math.min(.68,s.armour+.08);s.speed*=.88;}else if(focus==='hunter'){for(const k of ['spikeDps','biteDps','atk','horn'])if(typeof s[k]==='number')s[k]*=1.25;s.vision*=1.1;s.speed*=.92;}return s;}
function choose(current,next,dna){if(!Object.hasOwn(paths,next)||!Object.hasOwn(paths,current))throw Error('Unknown adaptation path.');if(current===next)throw Error('This path is already active.');if(!Number.isFinite(dna)||dna<COST)throw Error('Collect '+COST+' DNA before choosing a path.');return {focus:next,dna:dna-COST};}
const api={COST,paths,apply,choose};if(typeof module!=='undefined')module.exports=api;root.ZoeticaAdaptations=api;
})(globalThis);
