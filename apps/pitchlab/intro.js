/* One user-initiated official YouTube intro per tab session. No copied audio. */
(()=>{'use strict';const KEY='pitchlab-tab-intro-oOLJc2hRtVw-v1',$=id=>document.getElementById(id);let seen=false;
try{seen=sessionStorage.getItem(KEY)==='seen';}catch(_){}
const banner=$('footballIntroBanner'),dialog=$('footballIntro');banner.hidden=seen;
function remember(){seen=true;try{sessionStorage.setItem(KEY,'seen');}catch(_){}banner.hidden=true;document.removeEventListener('click',first,true);}
function first(event){if(!event.isTrusted||seen)return;if(event.target.closest('#skipFootballIntro')){remember();return;}remember();const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/oOLJc2hRtVw?autoplay=1&rel=0';frame.title='Owner-selected Alefantos football intro';frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';$('footballIntroPlayer').replaceChildren(frame);dialog.showModal();}
$('skipFootballIntro').onclick=remember;$('closeFootballIntro').onclick=()=>dialog.close();dialog.addEventListener('close',()=>$('footballIntroPlayer').replaceChildren());window.addEventListener('pagehide',()=>$('footballIntroPlayer').replaceChildren());if(!seen)document.addEventListener('click',first,true);
})();
