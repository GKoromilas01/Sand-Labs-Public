/* Original puzzle state. No storage, requests, payments, or randomness. */
(function(root){'use strict';
const initial=()=>({inventory:[],fixed:false,poster:false,distracted:false,won:false,grinder:false,permit:false,journeyWon:false,debt:18.5,speaker:'Παύλος',line:'Έχω ένα σχέδιο. Δεν είναι καλό, αλλά είναι δωρεάν.'});
function act(previous,target,item){
 if(previous.won&&['spoon','radio','poster','mitsos','speech','ledger'].includes(target))return previous;
 const s={...previous,inventory:[...previous.inventory],speaker:'Παύλος'};
 const say=(speaker,line)=>{s.speaker=speaker;s.line=line;return s;};
 switch(target){
 case 'key':
  if(s.grinder||s.inventory.includes('key'))return say('Παύλος','Ένα κλειδί αρκεί. Δεν ανοίγουμε αλυσίδα καφενείων.');
  s.inventory.push('key');return say('Παύλος','Ένα ορειχάλκινο κλειδί στο λιμάνι. Μοιάζει με το κλειδί του μύλου του Μήτσου. Διεθνής εφοδιαστική!');
 case 'grinder':
  if(s.grinder)return say('Μπάρμπα Μήτσος','Ο καφές έγινε. Ο λογαριασμός μεγαλώνει από μόνος του.');
  if(item!=='key'||!s.inventory.includes('key'))return say('Μπάρμπα Μήτσος','Ο μύλος είναι κλειδωμένος. Το κλειδί το πήρε ο καπετάνιος στο λιμάνι. Τυπική διαχείριση εξοπλισμού.');
  s.grinder=true;s.inventory=s.inventory.filter(x=>x!=='key');s.inventory.push('coffee');return say('Παύλος','Καφές για τον υπάλληλο της πλατείας. Επιτέλους ένα καύσιμο που κινεί το δημόσιο.');
 case 'clerk':
  if(s.permit)return say('Υπάλληλος','Η άδεια εκδόθηκε. Μην τη διπλώσεις, θα χρειαστεί άδεια αναδίπλωσης.');
  if(item!=='coffee'||!s.inventory.includes('coffee'))return say('Υπάλληλος','Για την άδεια του πανηγυριού χρειάζομαι καφέ από του Μήτσου. Χωρίς καφέ η σφραγίδα κοιμάται.');
  s.permit=true;s.inventory=s.inventory.filter(x=>x!=='coffee');s.inventory.push('permit');return say('Υπάλληλος','Καφές παραλήφθηκε. Άδεια εκδόθηκε. Το κράτος λειτούργησε για δεκατρία δευτερόλεπτα!');
 case 'boat':
  if(s.journeyWon)return say('Καπετάνιος','Το δρομολόγιο εγκρίθηκε. Η θάλασσα δεν υπέγραψε ακόμα.');
  if(item!=='permit'||!s.inventory.includes('permit'))return say('Καπετάνιος','Το πλοίο πάει στο πανηγύρι μόλις φέρεις την άδεια από την πλατεία. Ο γλάρος δεν μετράει ως υπογραφή.');
  s.journeyWon=true;s.inventory=s.inventory.filter(x=>x!=='permit');return say('Καπετάνιος','Άδεια, καφές και κλειδί: ολόκληρη Οδύσσεια για ένα δρομολόγιο! Το πανηγύρι ξεκινά. Το χρέος σου στον Μήτσο παραμένει.');
 case 'gull':return say('Γλάρος','Κρα! Εγώ κλέβω πατάτες. Εσύ το λες επιχειρηματικότητα.');
 case 'fountain':return say('Παύλος','Έριξα ευχή για λεφτά. Το σιντριβάνι ζήτησε φορολογική ενημερότητα.');
 case 'spoon':
  if(s.fixed)return say('Παύλος','Το κουτάλι πήρε προαγωγή. Τώρα είναι εξάρτημα υψηλής γαστρονομίας.');
  if(s.inventory.includes('spoon'))return say('Παύλος','Ένα κουτάλι έχω. Μην το κάνουμε δημόσια υπηρεσία.');
  s.inventory.push('spoon');return say('Παύλος','Κουτάλι: πιάνει ζάχαρη, καφέ και δημόσια έργα. Το δανείζομαι.');
 case 'radio':
  if(s.fixed)return say('Μπάρμπα Μήτσος','Παίζει! Σαν μπουζούκι που του ήρθε ο λογαριασμός του ρεύματος.');
  if(item==='spoon'&&s.inventory.includes('spoon')){s.fixed=true;s.inventory=s.inventory.filter(x=>x!=='spoon');return say('Παύλος','Το σπασμένο κουμπί θέλει κουτάλι. Τεχνικός είμαι, όχι κανένας τυχαίος που χρωστάει.');}
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
