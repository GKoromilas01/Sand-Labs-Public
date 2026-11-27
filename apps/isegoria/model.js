(function(root){
'use strict';
const fields=['title','problem','people','solution','costs','drawbacks','discussion'];
const options=['Support','Oppose','Unsure'];
function createStore(storage){
const key='isegoria-0.2';
function read(){let data;try{data=JSON.parse(storage.getItem(key))}catch(e){}return {draft:data?.draft||null,proposals:Array.isArray(data?.proposals)?data.proposals:[],vote:options.includes(data?.vote)?data.vote:null}}
function write(data){storage.setItem(key,JSON.stringify(data));return data}
return {read,saveDraft(draft){return write({...read(),draft})},submit(input){const p={};for(const f of fields){if(typeof input[f]!=='string'||!input[f].trim())throw Error('Please complete '+f+'.');if(input[f].length>(f==='title'?120:2000))throw Error(f+' is too long.');p[f]=input[f].trim()}const state=read();p.created=new Date().toISOString();state.proposals.unshift(p);state.draft=null;write(state);return p},vote(option){if(!options.includes(option))throw Error('Invalid poll option.');const state=read();if(state.vote)throw Error('This browser has already voted.');state.vote=option;write(state)},export(){return JSON.stringify({application:'Agora 0.4',scope:'This browser only',proposals:read().proposals},null,2)}};
}
const api={createStore,fields,options};if(typeof module!=='undefined')module.exports=api;else root.Isegoria=api;
})(globalThis);
