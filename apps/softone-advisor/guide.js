(function(root){'use strict';
const sources=[
 {id:'docs',name:'SoftOne Wiki',kind:'Official documentation',priority:1,url:'https://wiki.soft1.eu/',keywords:'softone soft1 series 5 6 σειρά τεκμηρίωση manual documentation configuration installation παραμετροποίηση εγκατάσταση',note:'Choose documentation for your exact installed series and version.'},
 {id:'api',name:'SoftOne developer examples',kind:'Repository search',priority:1,url:'https://github.com/search?q=SoftOne+Developers+Network&type=repositories',keywords:'api web service webservice jswebservices javascript sbsl sdk προγραμματισμός κώδικας',note:'Find the official repository and verify provenance, licence and version compatibility before using code.'},
 {id:'training',name:'ENTERSOFTONE training',kind:'Training material search',priority:1,url:'https://www.youtube.com/results?search_query=ENTERSOFTONE+training',keywords:'training course education official εκπαίδευση βίντεο video webinar μάθημα',note:'Confirm the video belongs to the official channel and applies to your version.'},
 {id:'mydata',name:'AADE / myDATA',kind:'Official authority',priority:2,url:'https://www.aade.gr/mydata',keywords:'invoicing specifications mydata ααδε τιμολόγηση τιμολόγιο διαβίβαση παραστατικό παράστατικό ΦΠΑ ψηφιακό δελτίο αποστολής',note:'Use the current technical specification and exact response message. This demo does not provide tax advice.'},
 {id:'b2g',name:'GSIS / e-invoicing',kind:'Official authority',priority:2,url:'https://www.gsis.gr/',keywords:'e-invoicing government b2g δημόσιο ηλεκτρονική τιμολόγηση προμήθεια',note:'Find current B2G guidance and confirm the authority and test environment.'},
 {id:'community',name:'Community examples',kind:'Unverified community',priority:3,url:'https://github.com/search?q=SoftOne+SBSL&type=repositories',keywords:'community examples forum κοινότητα παράδειγμα sbsl script',note:'Record the origin, date and licence. Do not treat community content as official documentation.'}
].map(s=>({...s,status:'not-collected'}));
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('el').replace(/ς/g,'σ');
const stop=new Set(['και','στο','στη','στην','τον','την','του','που','πωσ','εχω','για','with','the','τι']);
const tokens=s=>[...new Set(normalize(s).match(/[\p{L}\p{N}]+/gu)||[])].filter(w=>w.length>2&&!stop.has(w));
function search(query){const words=tokens(query);return sources.map(s=>({s,score:words.filter(w=>normalize(s.keywords+' '+s.name).includes(w)).length})).filter(x=>x.score).sort((a,b)=>b.score-a.score||a.s.priority-b.s.priority).map(x=>x.s);}
function excerpts(query,docs){const words=tokens(query);if(!words.length)return[];return docs.flatMap(d=>d.text.split(/\n\s*\n/).map(quote=>({name:d.name,quote:quote.trim(),score:words.filter(w=>normalize(quote).includes(w)).length}))).filter(x=>x.score&&x.quote).sort((a,b)=>b.score-a.score).slice(0,6);}
const api={sources,search,excerpts};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SoftOneGuide=api;
})(typeof globalThis!=='undefined'?globalThis:this);
