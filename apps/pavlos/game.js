'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 let state=PavlosPuzzle.initial(),selected=null,started=false;
 const targets=[...document.querySelectorAll('[data-target]')];
 const main=document.querySelector('.cabinet');main.inert=true;
 function render(){
  $('speaker').textContent=state.speaker.toLocaleUpperCase('el');$('line').textContent=state.line;
  $('radio-spoon').setAttribute('visibility',state.fixed?'visible':'hidden');
  $('spoon-art').style.opacity=state.inventory.includes('spoon')||state.fixed?'0':'1';
  $('ledger-art').style.opacity=state.won?'.3':'1';
  $('step1').classList.toggle('done',state.fixed);$('step2').classList.toggle('done',state.poster);$('step3').classList.toggle('done',state.distracted);
  $('objective').textContent=state.won?'Ο Μήτσος γέλασε. Εσύ αύριο πλένεις.':state.distracted?'Τώρα! Ρίξε μια ματιά στο τεφτέρι.':'Ρίξε μια ματιά στο τεφτέρι.';
  $('progress').textContent=state.won?'Ο γρίφος τελείωσε. Το βερεσέ όχι.':state.distracted?'Ο Μήτσος ψάχνει από πού έρχεται το μπάσο.':state.fixed?'Το ραδιόφωνο παίζει. Χρειάζεσαι μια ιδέα για διάγγελμα.':'Πρώτα πρέπει να τραβήξεις αλλού την προσοχή του Μήτσου.';
  $('inventory').replaceChildren();
  if(state.inventory.length){const button=document.createElement('button');button.id='inventory-spoon';button.textContent='🥄 Κουτάλι';button.setAttribute('aria-pressed',String(selected==='spoon'));button.addEventListener('click',()=>{selected=selected?'': 'spoon';render();$('inventory-spoon').focus();});$('inventory').append(button);}
  else{const p=document.createElement('p');p.className='empty';p.textContent=state.fixed?'Το κουτάλι είναι πλέον τεχνολογία.':'Χνούδι. Και υπερβολική σιγουριά.';$('inventory').append(p);}
  $('selection').textContent=selected?'Κουτάλι επιλεγμένο → πάτησε τον στόχο. Escape για ακύρωση.':'Πάτησε αντικείμενα στη σκηνή ή στη λίστα.';
  targets.forEach(t=>t.disabled=state.won);$('hint').disabled=state.won;
  $('ending').hidden=!state.won;
 }
 targets.forEach(button=>button.addEventListener('click',()=>{
  if(!started)return;
  const previous=state;state=PavlosPuzzle.act(state,button.dataset.target,selected);
  if(state.fixed&&!previous.fixed)selected=null;
  render();
  if(!previous.won&&state.won){$('endingTitle').focus();$('ending').scrollIntoView({behavior:'auto',block:'nearest'});}
 }));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&started){const restore=document.activeElement?.id==='inventory-spoon';selected=null;render();if(restore)$('inventory-spoon')?.focus();}});
 $('hint').addEventListener('click',()=>{
  $('hintText').textContent=!state.fixed?(state.inventory.includes('spoon')?'Διάλεξε το κουτάλι από τις τσέπες σου και πάτησε το ραδιόφωνο.':'Το κουμπί του ραδιοφώνου λείπει. Κοίτα το κουτάλι πάνω στον πάγκο.'):!state.poster?'Η αφίσα αριστερά γράφει ποιος ζητάει ομιλητές.':!state.distracted?'Πάτησε τον Παύλο για να βγάλει το πιο άχρηστο διάγγελμα της χρονιάς.':'Το τεφτέρι είναι στη δεξιά άκρη του πάγκου. Τώρα είναι η στιγμή.';
 });
 function reset(){state=PavlosPuzzle.initial();selected=null;$('hintText').textContent='';render();document.querySelector('.spot.poster').focus();document.querySelector('.play-area').scrollIntoView({block:'nearest'});}
 $('restart').addEventListener('click',reset);$('again').addEventListener('click',reset);
 $('start').addEventListener('click',()=>{started=true;$('welcome').hidden=true;main.inert=false;document.querySelector('.spot.mitsos').focus();});
 // Modal focus stays on the only action until the scene begins.
 $('start').focus();$('welcome').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();$('start').focus();}});
 // Original algorithmic 9/8 cafe miniature. No sampled/commercial recordings.
 let context,master,timer=null,noteIndex=0,wanted=false,active=false;
 const melody=[62,0,65,69,67,0,64,65,62,0,57,60,62,0,65,64,61,57];
 const hz=m=>440*Math.pow(2,(m-69)/12);
 function tone(midi,when,duration,amount,type='triangle',cutoff=1800){
  const osc=context.createOscillator(),env=context.createGain(),filter=context.createBiquadFilter();
  osc.type=type;osc.frequency.setValueAtTime(hz(midi),when);
  filter.type='lowpass';filter.frequency.setValueAtTime(cutoff,when);
  env.gain.setValueAtTime(0,when);env.gain.linearRampToValueAtTime(amount,when+.008);env.gain.exponentialRampToValueAtTime(.0001,when+duration);
  osc.connect(filter);filter.connect(env);env.connect(master);osc.start(when);osc.stop(when+duration+.02);
  osc.onended=()=>{osc.disconnect();filter.disconnect();env.disconnect();};
 }
 function beat(){
  if(!active)return;
  const t=context.currentTime+.02,n=melody[noteIndex%melody.length];
  if(n){tone(n+12,t,.23,.16,'sawtooth',2200);tone(n+19,t+.026,.2,.055,'triangle',1300);}
  if(noteIndex%9===0||noteIndex%9===4||noteIndex%9===6)tone(noteIndex%18<9?38:33,t,.19,.3,'sine',300);
  if(noteIndex%3===2)tone(81,t,.06,.035,'square',950);
  noteIndex++;timer=setTimeout(beat,215);
 }
 function stopSound(){active=false;clearTimeout(timer);timer=null;document.body.classList.remove('music-playing');if(context){master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(0,context.currentTime);context.suspend().catch(()=>{});}}
 function soundUI(){const button=$('sound');button.setAttribute('aria-pressed',String(wanted));button.textContent=wanted?'♫ Μουσική: ανοιχτή · σίγαση':'♫ Μουσική: κλειστή';}
 async function playSound(){
  try{
   const Audio=window.AudioContext||window.webkitAudioContext;
   if(!Audio)throw Error('Audio unavailable');
   if(!context){context=new Audio();master=context.createGain();master.gain.value=0;master.connect(context.destination);}
   await context.resume();
   if(!wanted||document.hidden){stopSound();return;}
   master.gain.setValueAtTime(Number($('volume').value)/100*.4,context.currentTime);
   if(!active){active=true;beat();}document.body.classList.add('music-playing');
  }catch(e){wanted=false;stopSound();soundUI();$('hintText').textContent='Ο ήχος δεν είναι διαθέσιμος σε αυτόν τον browser. Το παιχνίδι συνεχίζεται κανονικά.';}
 }
 $('sound').addEventListener('click',()=>{wanted=!wanted;soundUI();if(wanted)playSound();else stopSound();});
 $('volume').addEventListener('input',()=>{if(context&&active)master.gain.setValueAtTime(Number($('volume').value)/100*.4,context.currentTime);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSound();else if(wanted)playSound();});
 window.addEventListener('pagehide',stopSound);
 render();
})();
