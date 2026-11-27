'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 let state=PavlosPuzzle.initial(),selected=null,started=false;
 const targets=[...document.querySelectorAll('[data-target]')];
 const main=document.querySelector('.cabinet');main.inert=true;
 document.querySelectorAll('.guide-copy').forEach(host=>host.append($('guideTemplate').content.cloneNode(true)));
 $('howTo').addEventListener('click',()=>$('howToDialog').showModal());
 $('closeHowTo').addEventListener('click',()=>$('howToDialog').close());
 $('howToDialog').addEventListener('close',()=>$('howTo').focus());
 function render(){
  $('speaker').textContent=state.speaker.toLocaleUpperCase('el');$('line').textContent=state.line;
  $('radio-spoon').setAttribute('visibility',state.fixed?'visible':'hidden');
  $('spoon-art').style.opacity=state.inventory.includes('spoon')||state.fixed?'0':'1';
  $('ledger-art').style.opacity=state.won?'.3':'1';
  $('step1').classList.toggle('done',state.fixed);$('step2').classList.toggle('done',state.poster);$('step3').classList.toggle('done',state.distracted);
  $('objective').textContent=state.won?'Ο Μήτσος γέλασε. Εσύ αύριο πλένεις.':state.distracted?'Τώρα! Ρίξε μια ματιά στο τεφτέρι.':'Ρίξε μια ματιά στο τεφτέρι.';
  $('progress').textContent=state.won?'Ο γρίφος τελείωσε. Το βερεσέ όχι.':state.distracted?'Ο Μήτσος ψάχνει από πού έρχεται το μπάσο.':state.fixed?'Το ραδιόφωνο παίζει. Χρειάζεσαι μια ιδέα για διάγγελμα.':'Πρώτα πρέπει να τραβήξεις αλλού την προσοχή του Μήτσου.';
  $('inventory').replaceChildren();
  if(state.inventory.length){const button=document.createElement('button');button.id='inventory-spoon';button.textContent='🥄 Spoon · Κουτάλι';button.setAttribute('aria-pressed',String(selected==='spoon'));button.addEventListener('click',()=>{selected=selected?'': 'spoon';render();$('inventory-spoon').focus();});$('inventory').append(button);}
  else{const p=document.createElement('p');p.className='empty';p.textContent=state.fixed?'Spoon used to fix the radio.':'No items yet. Click Spoon to pick it up.';$('inventory').append(p);}
  $('selection').textContent=selected?'✓ Spoon selected. Click Radio (Ραδιόφωνο) to use it. Escape: deselect.':state.fixed?'Item used. Follow the next step in the goal panel.':'Items you collect appear here. Click an item to select it.';
  document.querySelector('.pockets').classList.toggle('has-item',state.inventory.length>0);
  $('objective').textContent=state.won?'Chapter complete. The debt remains €18.50.':!state.fixed?(state.inventory.includes('spoon')?'Next: use Spoon on Radio.':'First: pick up the Spoon.'):!state.poster?'Next: read the Poster.':!state.distracted?'Next: Make a speech to distract Mitsos.':'Now: inspect the Ledger.';
  targets.forEach(t=>t.disabled=state.won);$('hint').disabled=state.won;
  $('ending').hidden=!state.won;
 }
 targets.forEach(button=>button.addEventListener('click',()=>{
  if(!started)return;
  const previous=state;state=PavlosPuzzle.act(state,button.dataset.target,selected);
  if(!previous.inventory.includes('spoon')&&state.inventory.includes('spoon'))selected='spoon';
  if(state.fixed&&!previous.fixed)selected=null;
  render();
  if(!previous.inventory.includes('spoon')&&state.inventory.includes('spoon'))$('inventoryTitle').scrollIntoView({block:'nearest',behavior:'auto'});
  if(!previous.won&&state.won){$('endingTitle').focus();$('ending').scrollIntoView({behavior:'auto',block:'nearest'});}
 }));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&started&&!$('howToDialog').open){const restore=document.activeElement?.id==='inventory-spoon';selected=null;render();if(restore)$('inventory-spoon')?.focus();}});
 $('hint').addEventListener('click',()=>{
  $('hintText').textContent=!state.fixed?(state.inventory.includes('spoon')?'Διάλεξε το κουτάλι από τις τσέπες σου και πάτησε το ραδιόφωνο.':'Το κουμπί του ραδιοφώνου λείπει. Κοίτα το κουτάλι πάνω στον πάγκο.'):!state.poster?'Η αφίσα αριστερά γράφει ποιος ζητάει ομιλητές.':!state.distracted?'Πάτησε τον Παύλο για να βγάλει το πιο άχρηστο διάγγελμα της χρονιάς.':'Το τεφτέρι είναι στη δεξιά άκρη του πάγκου. Τώρα είναι η στιγμή.';
 });
 function reset(){state=PavlosPuzzle.initial();selected=null;$('hintText').textContent='';render();document.querySelector('.spot.poster').focus();document.querySelector('.play-area').scrollIntoView({block:'nearest'});}
 $('restart').addEventListener('click',reset);$('again').addEventListener('click',reset);
 function begin(music){started=true;$('welcome').hidden=true;main.inert=false;document.querySelector('.spot.mitsos').focus();if(music){wanted=true;noteIndex=0;soundUI();playSound();}}
 $('start').addEventListener('click',()=>begin(true));$('startSilent').addEventListener('click',()=>begin(false));
 // Keep keyboard focus within visible title-screen controls until the scene begins.
 $('start').focus({preventScroll:true});$('welcome').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const buttons=[...$('welcome').querySelectorAll('button,a,summary')].filter(el=>el.getClientRects().length>0);const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}});
 // Original fast six-eight bouzouki-style overture; no recordings or borrowed melody.
 let context,master,stringsWave,noise,timer=null,noteIndex=0,wanted=false,active=false;
 const intro=[74,77,76,74,73,69,70,73,74,0,81,79,77,76,74,69,73,74,81,79,77,76,74,0,74,86,81,77,76,74,73,69,70,73,74,0,77,76,74,73,69,65,64,65,69,73,74,0];
 const melody=[74,0,77,81,79,0,76,77,74,0,69,72,74,0,77,76,73,69];
 const hz=m=>440*Math.pow(2,(m-69)/12);
 function tone(midi,when,duration,amount,type='triangle',cutoff=1800,slide=0){
  const osc=context.createOscillator(),env=context.createGain(),filter=context.createBiquadFilter();
  osc.type=type;osc.frequency.setValueAtTime(hz(midi),when);
  if(slide)osc.frequency.exponentialRampToValueAtTime(hz(midi+slide),when+duration*.8);
  filter.type='lowpass';filter.frequency.setValueAtTime(cutoff,when);
  env.gain.setValueAtTime(0,when);env.gain.linearRampToValueAtTime(amount,when+.004);env.gain.exponentialRampToValueAtTime(.0001,when+duration);
  osc.connect(filter);filter.connect(env);env.connect(master);osc.start(when);osc.stop(when+duration+.02);
  osc.onended=()=>{osc.disconnect();filter.disconnect();env.disconnect();};
 }
 function pluck(midi,when,strength){
  for(const cents of [-4,4]){
   const osc=context.createOscillator(),filter=context.createBiquadFilter(),env=context.createGain();
   osc.setPeriodicWave(stringsWave);osc.frequency.setValueAtTime(hz(midi),when);osc.detune.setValueAtTime(cents,when);
   filter.type='lowpass';filter.Q.value=.65;filter.frequency.setValueAtTime(6000,when);filter.frequency.exponentialRampToValueAtTime(800,when+.28);
   env.gain.setValueAtTime(0,when);env.gain.linearRampToValueAtTime(strength*.5,when+.002);env.gain.exponentialRampToValueAtTime(.0001,when+.36);
   osc.connect(filter);filter.connect(env);env.connect(master);osc.start(when);osc.stop(when+.38);
   osc.onended=()=>{osc.disconnect();filter.disconnect();env.disconnect();};
  }
 }
 function tap(when){
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),env=context.createGain();source.buffer=noise;filter.type='highpass';filter.frequency.value=2800;
  env.gain.setValueAtTime(.075,when);env.gain.exponentialRampToValueAtTime(.0001,when+.055);
  source.connect(filter);filter.connect(env);env.connect(master);source.start(when);source.stop(when+.06);source.onended=()=>{source.disconnect();filter.disconnect();env.disconnect();};
 }
 function beat(){
  if(!active)return;
  const t=context.currentTime+.02,isIntro=noteIndex<intro.length;
  const step=isIntro?noteIndex:noteIndex-intro.length,n=isIntro?intro[step]:melody[step%melody.length];
  if(n){pluck(n,t,isIntro?.22:.13);if(step%6===2||step%6===5)pluck(n,t+.055,isIntro?.13:.07);}
  if(step%6===0||step%6===3)tone(step%12<6?38:45,t,.18,isIntro?.3:.2,'sine',300);
  if(step%3===2)tap(t);
  if(isIntro&&step%12===10)tone(57,t,.16,.12,'triangle',1200,-12);
  noteIndex++;timer=setTimeout(beat,isIntro?118:155);
 }
 function stopSound(){active=false;clearTimeout(timer);timer=null;document.body.classList.remove('music-playing');if(context){master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(0,context.currentTime);context.suspend().catch(()=>{});}}
 function soundUI(){const button=$('sound');button.setAttribute('aria-pressed',String(wanted));button.textContent=wanted?'♫ Μουσική: ανοιχτή · σίγαση':'♫ Μουσική: κλειστή';}
 async function playSound(){
  try{
   const Audio=window.AudioContext||window.webkitAudioContext;
   if(!Audio)throw Error('Audio unavailable');
   if(!context){context=new Audio();master=context.createGain();master.gain.value=0;master.connect(context.destination);stringsWave=context.createPeriodicWave(new Float32Array(9),new Float32Array([0,1,.62,.4,.3,.23,.18,.12,.08]));noise=context.createBuffer(1,Math.ceil(context.sampleRate*.07),context.sampleRate);const data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);}
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
