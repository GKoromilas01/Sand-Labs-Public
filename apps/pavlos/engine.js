/* Original puzzle state. No storage, requests, payments, or randomness. */
(function(root){'use strict';
const initial=()=>({inventory:[],fixed:false,poster:false,distracted:false,won:false,debt:18.5,speaker:'Παύλος',line:'Έχω ένα σχέδιο. Δεν είναι καλό, αλλά είναι δωρεάν.'});
function act(previous,target,item){
 if(previous.won)return previous;
 const s={...previous,inventory:[...previous.inventory],speaker:'Παύλος'};
 const say=(speaker,line)=>{s.speaker=speaker;s.line=line;return s;};
 switch(target){
 case 'spoon':
  if(s.fixed)return say('Παύλος','Το κουτάλι πήρε προαγωγή. Τώρα είναι εξάρτημα υψηλής γαστρονομίας.');
  if(s.inventory.includes('spoon'))return say('Παύλος','Ένα κουτάλι έχω. Μην το κάνουμε δημόσια υπηρεσία.');
  s.inventory.push('spoon');return say('Παύλος','Κουτάλι: πιάνει ζάχαρη, καφέ και δημόσια έργα. Το δανείζομαι.');
 case 'radio':
  if(s.fixed)return say('Μπάρμπα Μήτσος','Παίζει! Σαν μπουζούκι που του ήρθε ο λογαριασμός του ρεύματος.');
  if(item==='spoon'&&s.inventory.includes('spoon')){s.fixed=true;s.inventory=[];return say('Παύλος','Το σπασμένο κουμπί θέλει κουτάλι. Τεχνικός είμαι, όχι κανένας τυχαίος που χρωστάει.');}
  return say('Παύλος','Λείπει το κουμπί του κουρδίσματος. Θέλει κάτι στενό για μοχλό. Όχι άλλη επιτροπή.');
 case 'poster':s.poster=true;return say('Παύλος','«Πρόβες για το πανηγύρι: ομιλητές με δικά τους λόγια». Έχω πολλά. Όλα δανεικά.');
 case 'mitsos':
  if(s.distracted)return say('Μπάρμπα Μήτσος','Πώς έβαλες μπάσο σε ραδιόφωνο του ’55; Ακόμα το ερευνώ.');
  return say('Μπάρμπα Μήτσος','Δεκαοχτώ και πενήντα. Το βερεσέ δεν είναι πολιτιστική χορηγία, Παύλο.');
 case 'speech':
  if(!s.fixed)return say('Μπάρμπα Μήτσος','Χωρίς μουσική δεν έχει διάγγελμα. Φτιάξε πρώτα το ρημάδι το ραδιόφωνο.');
  if(!s.poster)return say('Παύλος','Έχω κοινό και μουσική, αλλά όχι θέμα. Κάπου εδώ θα υπάρχει μια αφίσα να αντιγράψω.');
  s.distracted=true;return say('Παύλος','Συμπολίτες! Το χρέος μου είναι άυλη πολιτιστική κληρονομιά! Μήτσο, πρόσεχε το σόλο, είναι εισαγόμενο από το μέλλον.');
 case 'ledger':
  if(!s.distracted)return say('Μπάρμπα Μήτσος','Κάτω τα χέρια από το τεφτέρι. Το μόνο που σβήνω δωρεάν είναι το φως.');
  s.won=true;return say('Μπάρμπα Μήτσος','18,50 παραμένουν. Αλλά με έκανες να γελάσω. Αύριο πλένεις ποτήρια. Πολιτισμός είναι να μην τα φορτώνεις στον άλλον.');
 default:return say('Παύλος','Αυτό δεν περιλαμβάνεται στη μελέτη σκοπιμότητας.');
 }
}
const api={initial,act};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PavlosPuzzle=api;
})(typeof globalThis!=='undefined'?globalThis:this);
