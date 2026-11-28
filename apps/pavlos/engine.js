/* Original puzzle state. No storage, requests, payments, or randomness. */
(function(root){'use strict';
const L=["You fixed my radio. Borrow the tools. If you lose them, I will add a workshop to your tab.", "Fix my radio first. Your technical CV currently says: good at borrowing.", "The tools are already on loan. My generosity has a serial number.", "An audio cable! Finally, a connection without a cousin at the ministry.", "One cable is enough. We are connecting a microphone, not the entire civil service.", "The microphone needs a tool kit and a cable from backstage. Shouting is not a repair.", "The microphone works. Unfortunately, so does my voice. The village cannot have everything.", "Already repaired. Do not improve it until it breaks again.", "Borrow this rope. Bring it back with fewer political knots.", "The rope is already spoken for. Unlike the festival budget.", "The curtain is jammed. A rope would give me leverage. My speeches only give headaches.", "Behind the curtain: the missing programme! It was filed under things somebody else would do.", "The curtain is open. The organisational mystery is not.", "Bring the programme from backstage. A lectern without a schedule is just furniture with ambition.", "Programme posted. We now know precisely how late everything will be.", "The programme is already posted. Changing it requires three committees and a pencil.", "First approve my ferry with the permit, then post the programme in the hall. I deliver supplies, not rumours.", "Supplies delivered! Chairs, cups and one crate marked not my responsibility.", "The supplies are here. Nobody can eat a second delivery note.", "We need a working microphone, a posted programme and delivered supplies. Confidence is not on the equipment list.", "The festival is on! Five locations, twelve favours and no budget. Mitsos still wants his eighteen fifty.", "The festival is running. For once, let somebody else hold the microphone."];
const initial=()=>({inventory:[],fixed:false,poster:false,distracted:false,won:false,grinder:false,permit:false,journeyWon:false,toolsLoaned:false,cableTaken:false,micFixed:false,ropeTaken:false,curtainOpen:false,programmePosted:false,suppliesDelivered:false,festivalWon:false,debt:18.5,speaker:'Παύλος',line:'Έχω ένα σχέδιο. Δεν είναι καλό, αλλά είναι δωρεάν.'});
function act(previous,target,item){
 if(previous.won&&['spoon','radio','poster','mitsos','speech','ledger'].includes(target))return previous;
 const s={...previous,inventory:[...previous.inventory],speaker:'Παύλος'};
 const say=(speaker,line)=>{s.speaker=speaker;s.line=line;return s;};
 switch(target){
 case 'tools':if(s.toolsLoaned)return say('Μπάρμπα Μήτσος',L[2]);if(!s.fixed)return say('Μπάρμπα Μήτσος',L[1]);s.toolsLoaned=true;s.inventory.push('tools');return say('Μπάρμπα Μήτσος',L[0]);
 case 'cable':if(s.cableTaken)return say('Παύλος',L[4]);s.cableTaken=true;s.inventory.push('cable');return say('Παύλος',L[3]);
 case 'microphone':if(s.micFixed)return say('Παύλος',L[7]);if(item!=='tools'||!s.inventory.includes('tools')||!s.inventory.includes('cable'))return say('Παύλος',L[5]);s.micFixed=true;s.inventory=s.inventory.filter(x=>!['tools','cable'].includes(x));return say('Παύλος',L[6]);
 case 'rope':if(s.ropeTaken)return say('Καπετάνιος',L[9]);s.ropeTaken=true;s.inventory.push('rope');return say('Καπετάνιος',L[8]);
 case 'curtain':if(s.curtainOpen)return say('Παύλος',L[12]);if(item!=='rope'||!s.inventory.includes('rope'))return say('Παύλος',L[10]);s.curtainOpen=true;s.inventory=s.inventory.filter(x=>x!=='rope');s.inventory.push('programme');return say('Παύλος',L[11]);
 case 'lectern':if(s.programmePosted)return say('Παύλος',L[15]);if(item!=='programme'||!s.inventory.includes('programme'))return say('Παύλος',L[13]);s.programmePosted=true;s.inventory=s.inventory.filter(x=>x!=='programme');return say('Παύλος',L[14]);
 case 'supplies':if(s.suppliesDelivered)return say('Καπετάνιος',L[18]);if(!s.journeyWon||!s.programmePosted)return say('Καπετάνιος',L[16]);s.suppliesDelivered=true;return say('Καπετάνιος',L[17]);
 case 'festival':if(s.festivalWon)return say('Παύλος',L[21]);if(!s.micFixed||!s.programmePosted||!s.suppliesDelivered)return say('Παύλος',L[19]);s.festivalWon=true;return say('Παύλος',L[20]);

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
const hintRows=[["Find a small lever for the café radio.", "The spoon could fit the broken radio knob.", "Café: pick up Spoon, then use it on Radio."], ["Mitsos has useful equipment.", "Repairing his radio may earn you a favour.", "Café: choose Borrow tools after repairing Radio."], ["The hall microphone has no connection.", "Look backstage for a cable.", "Backstage: pick up Cable. Select Tool kit, then Repair microphone in the hall."], ["Something is hidden behind the backstage curtain.", "The captain has rope to unjam it.", "Harbour: pick up Rope. Backstage: use Rope on Open curtain."], ["The hall needs a schedule.", "Use the programme at the hall lectern.", "Select Festival programme, then Post programme in the hall."], ["The captain needs official permission.", "The clerk runs on coffee; the grinder needs the harbour key.", "Harbour key → café grinder → coffee to square clerk → permit to captain."], ["The equipment will not deliver itself.", "Return to the captain once the programme is posted.", "Harbour: choose Arrange supplies after ferry approval and posting the programme."], ["Everything is ready for an unlikely success.", "Return to the community hall.", "Community hall: choose Start festival."]];
function hint(s,level=0){if(s.festivalWon)return 'Festival complete. The café puzzle is still yours to finish.';const row=!s.fixed?0:!s.toolsLoaned?1:!s.micFixed?2:!s.curtainOpen?3:!s.programmePosted?4:!s.journeyWon?5:!s.suppliesDelivered?6:7;return hintRows[row][Math.max(0,Math.min(2,level))];}
const api={initial,act,hint};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PavlosPuzzle=api;
})(typeof globalThis!=='undefined'?globalThis:this);
