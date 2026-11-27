/* Original plucked-string model. No recordings or borrowed melody. */
(function(root){'use strict';
function samples(midi,rate){if(!Number.isFinite(midi)||midi<30||midi>100||!Number.isFinite(rate)||rate<8000||rate>192000)throw Error('Invalid string note');const freq=440*Math.pow(2,(midi-69)/12),period=Math.max(2,Math.round(rate/freq-.5)),ring=new Float32Array(period),out=new Float32Array(Math.ceil(rate*1.2));let seed=(midi*137+91)|0;for(let i=0;i<period;i++){seed=(Math.imul(seed,1664525)+1013904223)|0;ring[i]=((seed>>>0)/4294967296*2-1)*.65;}let prev=0,dc=0;for(let i=0;i<out.length;i++){const j=i%period,value=ring[j];ring[j]=.997*(value+ring[(j+1)%period])*.5;dc=.995*dc+value-prev;prev=value;out[i]=dc;}let peak=0;for(const v of out)peak=Math.max(peak,Math.abs(v));if(peak)for(let i=0;i<out.length;i++)out[i]=out[i]/peak*.65;return out;}
const api={samples};root.PavlosBouzouki=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
