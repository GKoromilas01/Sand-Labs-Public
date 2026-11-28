'use strict';
(()=>{
 const $=id=>document.getElementById(id);let state=PavlosPuzzle.initial(),selected=null,started=false,room='cafe',hintLevel=0,savedAdventure=null,pendingRestore=null,restoreGeneration=0,recoveryRaw=null;const main=document.querySelector('.cabinet');main.inert=true;
 const svg=$('scene').querySelector('svg'),cafeArt=svg.innerHTML,hero=$('pavlos-art').outerHTML;
 const labels={mitsos:'Talk to Mitsos',radio:'Use Radio',spoon:'Pick up Spoon',ledger:'Inspect Ledger',speech:'Make a speech',grinder:'Coffee grinder',poster:'Read Poster',clerk:'Talk to the clerk',fountain:'The fountain',key:'Pick up brass key',boat:'Talk to the captain',gull:'The gull'};
 Object.assign(labels,{tools:'Borrow tools',cable:'Pick up cable',microphone:'Repair microphone',rope:'Pick up rope',curtain:'Open curtain',lectern:'Post programme',supplies:'Arrange supplies',festival:'Start festival'});
 const items={spoon:'🥄 Spoon',key:'Brass key',coffee:'Coffee',permit:'Festival permit',tools:'Tool kit',cable:'Audio cable',rope:'Rope',programme:'Festival programme'};
 document.querySelectorAll('.guide-copy').forEach(host=>host.append($('guideTemplate').content.cloneNode(true)));
 $('gameLanguage').addEventListener('change',()=>PavlosLanguage.set($('gameLanguage').value));
 $('inventoryToggle').onclick=()=>{const open=$('inventoryDrawer').hidden;$('inventoryDrawer').hidden=!open;$('inventoryToggle').setAttribute('aria-expanded',String(open));};
 $('howTo').onclick=()=>$('howToDialog').showModal();$('closeHowTo').onclick=()=>$('howToDialog').close();$('howToDialog').addEventListener('close',()=>$('howTo').focus());
 $('stopVoice').onclick=()=>{$('voiceEnabled').checked=false;PavlosVoice.stop();};$('replayLine').onclick=()=>PavlosVoice.say(PavlosLanguage.text(state.line),true);
 function travel(where){if(!PavlosWorld.rooms[where])return;room=where;svg.innerHTML=room==='cafe'?cafeArt:PavlosWorld.rooms[room].art+hero;document.querySelectorAll('.scene>.spot').forEach(el=>el.hidden=room!=='cafe');$('scene').dataset.room=room;document.querySelectorAll('[data-room]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.room===room)));const controls=document.querySelector('.object-buttons');controls.replaceChildren();for(const action of PavlosWorld.rooms[room].actions){const b=document.createElement('button');b.dataset.target=action;b.textContent=labels[action];controls.append(b);}render();if(started){syncAudio();persistAdventure();}}
 function render(){
  $('currentLocation').textContent=PavlosWorld.rooms[room].name;$('speaker').textContent=state.speaker.toLocaleUpperCase('el');$('line').textContent=state.line;
  if(room==='cafe'){$('radio-spoon')?.setAttribute('visibility',state.fixed?'visible':'hidden');if($('spoon-art'))$('spoon-art').style.opacity=state.inventory.includes('spoon')||state.fixed?'0':'1';if($('ledger-art'))$('ledger-art').style.opacity=state.won?'.3':'1';}
  $('step1').classList.toggle('done',state.fixed);$('step2').classList.toggle('done',state.poster);$('step3').classList.toggle('done',state.distracted);
  $('objective').textContent=selected==='key'?'Take the brass key to the café grinder.':selected==='coffee'?'Take the coffee to the clerk in the square.':selected==='permit'?'Show the permit to the harbour captain.':state.journeyWon?'The festival ferry is approved. You can still visit every location.':state.won?'Explore the harbour for a key; Mitsos needs it for his grinder.':!state.fixed?(state.inventory.includes('spoon')?'Next: use Spoon on Radio.':'First: pick up the Spoon, or explore the other locations.'):!state.poster?'Next: read the Poster in the square.':!state.distracted?'Return to Mitsos and Make a speech.':'Now: inspect the Ledger.';
  if(!state.festivalWon)$('objective').textContent=PavlosPuzzle.hint(state,0);$('festivalEnding').hidden=!state.festivalWon;
  $('inventory').replaceChildren();for(const item of state.inventory){const b=document.createElement('button');b.id='inventory-'+item;b.textContent=items[item];b.setAttribute('aria-pressed',String(selected===item));b.onclick=()=>{selected=selected===item?null:item;render();$(b.id)?.focus();};$('inventory').append(b);}if(!state.inventory.length){const p=document.createElement('p');p.className='empty';p.textContent=state.fixed?'No items carried. Explore another location.':'No items yet. Pick up the Spoon or explore the harbour.';$('inventory').append(p);}
  $('inventoryCount').textContent=String(state.inventory.length);$('selection').textContent=selected==='spoon'?'✓ Spoon selected. Click Radio to use it. Escape: deselect.':selected?PavlosLanguage.text(items[selected])+': '+PavlosLanguage.text('Selected. Click the object or person to use it.'):'Items you collect appear here. Click an item to select it.';
  document.querySelector('.pockets').classList.toggle('has-item',state.inventory.length>0);$('hint').disabled=false;$('ending').hidden=!state.won;$('journeyEnding').hidden=!state.journeyWon;
 }
 document.addEventListener('click',e=>{const b=e.target.closest('[data-target]');if(!b||!started||b.hidden)return;const previous=state;state=PavlosPuzzle.act(state,b.dataset.target,selected);const added=state.inventory.find(x=>!previous.inventory.includes(x));if(added){selected=added;$('inventoryDrawer').hidden=false;$('inventoryToggle').setAttribute('aria-expanded','true');}else if(selected&&!state.inventory.includes(selected))selected=null;if(JSON.stringify(previous.inventory)!==JSON.stringify(state.inventory)||Object.keys(state).some(k=>typeof state[k]==='boolean'&&state[k]!==previous[k]))hintLevel=0;render();persistAdventure();PavlosVoice.say(PavlosLanguage.text(state.line));if(!previous.won&&state.won){$('endingTitle').focus();$('ending').scrollIntoView({block:'nearest'});}});
 document.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>travel(b.dataset.room));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&started&&!$('howToDialog').open){const id=document.activeElement?.id;selected=null;render();$(id)?.focus();}});
 $('hint').onclick=()=>{$('hintText').textContent=PavlosPuzzle.hint(state,hintLevel);hintLevel=Math.min(2,hintLevel+1);};
 function reset(){if(!confirm(PavlosLanguage.text('Start again and replace saved progress? Download a backup first if you want to keep it.')))return;hintLevel=0;PavlosVoice.stop();state=PavlosPuzzle.initial();selected=null;$('hintText').textContent='';$('inventoryDrawer').hidden=true;$('inventoryToggle').setAttribute('aria-expanded','false');travel('cafe');document.querySelector('.object-buttons button').focus({preventScroll:true});window.scrollTo(0,0);fitScene();}
 $('restart').onclick=reset;$('again').onclick=reset;
 function fitScene(){
  if(!started)return;
  const scene=$('scene'),area=scene.parentElement,caption=area.querySelector('.dialogue');
  const available=window.innerHeight-scene.getBoundingClientRect().top-caption.getBoundingClientRect().height-28;
  scene.style.width=Math.max(120,Math.min(area.clientWidth,available*1200/620))+'px';
 }
 const layoutObserver=new ResizeObserver(()=>fitScene());
 for(const el of document.querySelectorAll('.masthead,.topbar,.room-tabs,.play-area>.dialogue'))layoutObserver.observe(el);
 window.addEventListener('resize',fitScene);
 function begin(music,resume=false){if(!resume&&(savedAdventure||recoveryRaw)&&!confirm(PavlosLanguage.text('Start again and replace saved progress? Download a backup first if you want to keep it.')))return;if(resume){state=structuredClone(savedAdventure.state);room=savedAdventure.room;music=savedAdventure.music;}const startRoom=resume?room:'cafe';PavlosLanguage.set($('gameLanguage').value);started=true;$('welcome').hidden=true;main.inert=false;travel(startRoom);document.querySelector('.object-buttons button').focus({preventScroll:true});window.scrollTo(0,0);fitScene();if(music){wanted=true;noteIndex=0;syncAudio();}persistAdventure();}
 $('start').onclick=()=>begin(true);$('startSilent').onclick=()=>begin(false);$('start').focus({preventScroll:true});$('welcome').addEventListener('keydown',e=>{if(e.key==='Tab'){const buttons=[...$('welcome').querySelectorAll('button,a,summary,select,input')].filter(el=>!el.disabled&&el.getClientRects().length);e.preventDefault();const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();}});
 function downloadAdventure(raw,name='pavlos-adventure.json'){const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function persistAdventure(){if(!started)return;try{const d=PavlosSave.snapshot(state,room,PavlosLanguage.get(),wanted);localStorage.setItem(PavlosSave.KEY,JSON.stringify(d));savedAdventure=d;recoveryRaw=null;$('adventureSaveStatus').textContent='Saved on this device.';}catch(e){$('adventureSaveStatus').textContent='Not saved: browser storage is unavailable. Download a backup before leaving.';}}
 $('saveAdventure').onclick=persistAdventure;
 $('downloadAdventure').onclick=()=>downloadAdventure(JSON.stringify(PavlosSave.snapshot(state,room,PavlosLanguage.get(),wanted),null,2));
 $('continueAdventure').onclick=()=>begin(false,true);
 $('restoreAdventure').onchange=async()=>{const stamp=++restoreGeneration,file=$('restoreAdventure').files[0];pendingRestore=null;$('restoreAdventureReview').hidden=true;if(!file)return;try{if(file.size>100000)throw Error();const d=PavlosSave.parse(await file.text());if(stamp!==restoreGeneration)return;pendingRestore=d;$('restoreAdventureReview').hidden=false;}catch(e){if(stamp===restoreGeneration)$('adventureSaveStatus').textContent='Invalid backup. Existing progress is unchanged.';}};
 $('cancelAdventureRestore').onclick=()=>{restoreGeneration++;pendingRestore=null;$('restoreAdventure').value='';$('restoreAdventureReview').hidden=true;};
 $('welcomeRestore').onclick=()=>$('welcomeRestoreFile').click();
 $('welcomeRestoreFile').onchange=async()=>{const stamp=++restoreGeneration,file=$('welcomeRestoreFile').files[0];pendingRestore=null;$('welcomeRestoreReview').hidden=true;if(!file)return;try{if(file.size>100000)throw Error();const parsed=PavlosSave.parse(await file.text());if(stamp!==restoreGeneration)return;pendingRestore=parsed;$('welcomeRestoreReview').hidden=false;$('welcomeRestoreStatus').textContent='';}catch(e){if(stamp===restoreGeneration)$('welcomeRestoreStatus').textContent='Invalid backup. Existing progress is unchanged.';}};
 $('welcomeRestoreCancel').onclick=()=>{restoreGeneration++;pendingRestore=null;$('welcomeRestoreFile').value='';$('welcomeRestoreReview').hidden=true;};
 $('welcomeRestoreConfirm').onclick=()=>{if(!pendingRestore)return;savedAdventure=pendingRestore;pendingRestore=null;restoreGeneration++;$('gameLanguage').value=savedAdventure.language;$('welcomeRestoreReview').hidden=true;begin(false,true);};
 $('confirmAdventureRestore').onclick=()=>{if(!pendingRestore)return;state=structuredClone(pendingRestore.state);selected=null;hintLevel=0;PavlosVoice.stop();PavlosLanguage.set(pendingRestore.language);$('gameLanguage').value=pendingRestore.language;wanted=pendingRestore.music;const where=pendingRestore.room;pendingRestore=null;restoreGeneration++;$('restoreAdventure').value='';$('restoreAdventureReview').hidden=true;travel(where);persistAdventure();fitScene();};
 try{recoveryRaw=localStorage.getItem(PavlosSave.KEY);if(recoveryRaw){savedAdventure=PavlosSave.parse(recoveryRaw);$('continueAdventure').hidden=false;$('gameLanguage').value=savedAdventure.language;PavlosLanguage.set(savedAdventure.language);recoveryRaw=null;}}catch(e){if(recoveryRaw){const note=document.createElement('p');note.textContent='A stored adventure could not be opened. Download its recovery copy before replacing it.';const b=document.createElement('button');b.textContent='Download recovery copy';b.onclick=()=>downloadAdventure(recoveryRaw,'pavlos-recovery.json');$('welcome').querySelector('.welcome-card').append(note,b);}}
 // Original fast six-eight bouzouki-style overture; no recordings or borrowed melody.
 let context,master,stringsWave,noise,timer=null,noteIndex=0,wanted=false,active=false;
 const intro=[74,0,78,81,79,78,76,0,73,76,79,78,76,74,73,0,74,78,81,86,85,81,79,0,78,76,74,73,74,0,69,0];
 const melody=[74,78,81,0,79,78,76,0,73,76,79,0,78,76,74,0];
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
 const stringBuffers=new Map();
 function pluck(midi,when,strength){
  if(!stringBuffers.has(midi)){const samples=PavlosBouzouki.samples(midi,context.sampleRate);const buffer=context.createBuffer(1,samples.length,context.sampleRate);buffer.copyToChannel(samples,0);stringBuffers.set(midi,buffer);}
  for(const cents of [-3,3]){
   const source=context.createBufferSource(),body=context.createBiquadFilter(),env=context.createGain();source.buffer=stringBuffers.get(midi);source.playbackRate.value=Math.pow(2,cents/1200);body.type='peaking';body.frequency.value=1100;body.Q.value=.9;body.gain.value=4;
   env.gain.setValueAtTime(strength*.65,when);env.gain.exponentialRampToValueAtTime(.0001,when+1.15);source.connect(body);body.connect(env);env.connect(master);source.start(when);source.onended=()=>{source.disconnect();body.disconnect();env.disconnect();};
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
  if(step%4===0){pluck(step%8<4?50:57,t,.11);pluck(step%8<4?57:61,t+.025,.07);tone(step%8<4?38:45,t,.18,.08,'sine',300);}
  if(step%3===2)tap(t);
  if(isIntro&&step%12===10)tone(57,t,.16,.12,'triangle',1200,-12);
  noteIndex++;timer=setTimeout(beat,isIntro?Math.max(115,185-step*2):165);
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
 function syncAudio(){soundUI();if(!wanted||document.hidden){stopSound();return;}playSound();}
 $('sound').addEventListener('click',()=>{wanted=!wanted;syncAudio();});
 $('volume').addEventListener('input',()=>{if(context&&active)master.gain.setValueAtTime(Number($('volume').value)/100*.4,context.currentTime);});
 document.addEventListener('visibilitychange',syncAudio);
 document.addEventListener('pavlos:external-video',()=>{wanted=false;stopSound();soundUI();});
 window.addEventListener('pagehide',stopSound);window.addEventListener('pagehide',persistAdventure);
 render();
})();
