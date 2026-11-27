/* Portable save schema 1. Validate fully before touching the running world. */
(function(root){
const MAX_BACKUP_BYTES=2*1024*1024;
function validateBackup(d){
 const fail=m=>{throw Error(m||'This file is not a valid Zoetica game backup.');};
 const obj=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
 const num=(v,min=0,max=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
 const int=(v,min=0,max=1e9)=>num(v,min,max)&&Number.isInteger(v);
 const text=v=>typeof v==='string'&&v.length<=600&&!/[<>\u0000-\u0008]/.test(v);
 const bool=v=>typeof v==='boolean';
 if(!obj(d))fail();if(d.v!==1)fail('Unsupported backup version. Zoetica supports save format 1.');
 if(d.itemsCollected!==undefined&&(!obj(d.itemsCollected)||!Object.keys(d.itemsCollected).every(k=>['mineral','repair','current'].includes(k))||!['mineral','repair','current'].every(k=>int(d.itemsCollected[k]))))fail('Invalid item history.');
 // Reject prototype keys at any depth, including in optional history fields.
 const inspect=(v,depth=0)=>{if(depth>16)fail();if(v&&typeof v==='object'){for(const k of Object.keys(v)){if(['__proto__','prototype','constructor'].includes(k))fail();inspect(v[k],depth+1);}}else if(typeof v==='string'&&!text(v))fail();};inspect(d);
 const genome=(g,land=false)=>{
  if(!obj(g)||!int(g.size,1,6))return false;
  const parts=land?{legs:3,tail:2,horns:3,claws:2,shell:3,eyes:3}:{flagellum:3,spike:4,armour:3,eye:3,toxin:3,chloro:3};
  return Object.entries(parts).every(([k,max])=>(!land&&['toxin','chloro'].includes(k)&&g[k]===undefined)||int(g[k],['eye','eyes','legs'].includes(k)?1:0,max))&&(land?['herb','carn','omni']:['filter','jaw','omni']).includes(g.mouth);
 };
 const budget=b=>obj(b)&&['grazer','hunter','apex'].every(k=>int(b[k],0,100));
 const player=(p,land=false)=>obj(p)&&genome(p.g,land)&&['x','y'].every(k=>num(p[k],0,land?2800:2300))&&['dna','growth','kills','deaths'].every(k=>num(p[k]));
 if(!player(d.player)||!['plantDNA','meatDNA','sporesEaten','apexKills'].every(k=>num(d.player[k]))||!Array.isArray(d.player.forms)||d.player.forms.length>10000||!d.player.forms.every(f=>obj(f)&&num(f.t)&&text(f.txt)))fail();
 if(!num(d.time)||!int(d.spId,1)||!num(d.dirT,-100,10000)||!num(d.pressured)||!num(d.random)||!bool(d.apexDone)||!bool(d.stageShown)||!budget(d.budget)||!['cell','land'].includes(d.stage))fail();
 if(!Array.isArray(d.patches)||d.patches.length!==7||!d.patches.every(p=>Array.isArray(p)&&p.length===3&&num(p[0],0,2300)&&num(p[1],0,2300)&&num(p[2],0,10)))fail();
 if(!Array.isArray(d.all)||!d.all.length||d.all.length>5000)fail();
 const ids=new Map();for(const s of d.all){if(!obj(s)||(s.stage!==undefined&&!['cell','land'].includes(s.stage))||!int(s.id,1,d.spId)||ids.has(s.id)||!text(s.name)||!num(s.hue,0,360)||!['grazer','hunter','apex'].includes(s.role)||!num(s.w,0,100)||!int(s.gen,1)||!genome(s.genome,s.stage==='land'))fail();ids.set(s.id,s);}
 const refs=(a,land)=>Array.isArray(a)&&a.length>0&&a.length<=5000&&new Set(a).size===a.length&&a.every(id=>ids.has(id)&&(ids.get(id).stage==='land')===land);
 if(!refs(d.live,false))fail();
 if(d.land!==null){const l=d.land;if(!obj(l)||!player(l.lp,true)||!['Herbivore','Carnivore','Omnivore'].includes(l.lp.trait)||!refs(l.sp,true)||!bool(l.apex)||!budget(l.budget)||!num(l.dirT,-100,10000))fail();}
 if(d.stage==='land'&&!d.land)fail();return d;
}
const api={validateBackup,MAX_BACKUP_BYTES};if(typeof module!=='undefined')module.exports=api;root.ZoeticaBackup=api;
})(typeof window==='undefined'?globalThis:window);
