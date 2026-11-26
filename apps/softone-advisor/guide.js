(function(root){'use strict';
const sources=[
 {id:'docs',name:'SoftOne Wiki',kind:'Επίσημη τεκμηρίωση',priority:1,url:'https://wiki.soft1.eu/',keywords:'softone soft1 series 5 6 σειρά τεκμηρίωση manual παραμετροποίηση εγκατάσταση',note:'Επίλεξε τεκμηρίωση για τη συγκεκριμένη σειρά και έκδοση του συστήματός σου.'},
 {id:'api',name:'Παραδείγματα προγραμματιστών SoftOne',kind:'Αναζήτηση αποθετηρίων',priority:1,url:'https://github.com/search?q=SoftOne+Developers+Network&type=repositories',keywords:'api web service webservice jswebservices javascript sbsl sdk προγραμματισμός κώδικας',note:'Βρες το επίσημο αποθετήριο και επιβεβαίωσε προέλευση, άδεια και συμβατότητα έκδοσης πριν χρησιμοποιήσεις κώδικα.'},
 {id:'training',name:'ENTERSOFTONE εκπαίδευση',kind:'Αναζήτηση εκπαιδευτικού υλικού',priority:1,url:'https://www.youtube.com/results?search_query=ENTERSOFTONE+training',keywords:'εκπαίδευση βίντεο video webinar μάθημα',note:'Επιβεβαίωσε ότι το βίντεο ανήκει στο επίσημο κανάλι και αφορά τη δική σου έκδοση.'},
 {id:'mydata',name:'ΑΑΔΕ / myDATA',kind:'Επίσημη αρχή',priority:2,url:'https://www.aade.gr/mydata',keywords:'mydata ααδε τιμολόγηση τιμολόγιο διαβίβαση παραστατικό παράστατικό ΦΠΑ ψηφιακό δελτίο αποστολής',note:'Χρειάζεται η τρέχουσα τεχνική προδιαγραφή και το ακριβές μήνυμα απόκρισης. Αυτό το demo δεν παρέχει φορολογική γνωμοδότηση.'},
 {id:'b2g',name:'ΓΓΠΣ / ηλεκτρονική τιμολόγηση',kind:'Επίσημη αρχή',priority:2,url:'https://www.gsis.gr/',keywords:'b2g δημόσιο ηλεκτρονική τιμολόγηση προμήθεια',note:'Εντόπισε τις τρέχουσες οδηγίες B2G και επιβεβαίωσε τον φορέα και το περιβάλλον δοκιμών.'},
 {id:'community',name:'Κοινοτικά παραδείγματα',kind:'Μη επαληθευμένη κοινότητα',priority:3,url:'https://github.com/search?q=SoftOne+SBSL&type=repositories',keywords:'forum κοινότητα παράδειγμα sbsl script',note:'Κράτησε προέλευση, ημερομηνία και άδεια. Μην τα θεωρείς επίσημη τεκμηρίωση.'}
].map(s=>({...s,status:'not-collected'}));
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('el').replace(/ς/g,'σ');
const stop=new Set(['και','στο','στη','στην','τον','την','του','που','πωσ','εχω','για','with','the','τι']);
const tokens=s=>[...new Set(normalize(s).match(/[\p{L}\p{N}]+/gu)||[])].filter(w=>w.length>2&&!stop.has(w));
function search(query){const words=tokens(query);return sources.map(s=>({s,score:words.filter(w=>normalize(s.keywords+' '+s.name).includes(w)).length})).filter(x=>x.score).sort((a,b)=>b.score-a.score||a.s.priority-b.s.priority).map(x=>x.s);}
function excerpts(query,docs){const words=tokens(query);if(!words.length)return[];return docs.flatMap(d=>d.text.split(/\n\s*\n/).map(quote=>({name:d.name,quote:quote.trim(),score:words.filter(w=>normalize(quote).includes(w)).length}))).filter(x=>x.score&&x.quote).sort((a,b)=>b.score-a.score).slice(0,6);}
const api={sources,search,excerpts};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SoftOneGuide=api;
})(typeof globalThis!=='undefined'?globalThis:this);
