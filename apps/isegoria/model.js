(function(root){
'use strict';
const fields=['title','problem','people','solution','costs','drawbacks','discussion'];
const options=['Support','Oppose','Unsure'];
function createStore(storage){
const key='isegoria-0.2';
function read(){let data;try{data=JSON.parse(storage.getItem(key))}catch(e){}return {draft:data?.draft||null,proposals:Array.isArray(data?.proposals)?data.proposals:[],vote:options.includes(data?.vote)?data.vote:null}}
function write(data){storage.setItem(key,JSON.stringify(data));return data}
return {read,saveDraft(draft){return write({...read(),draft})},submit(input){const p={};for(const f of fields){if(typeof input[f]!=='string'||!input[f].trim())throw Error('Please complete '+f+'.');if(input[f].length>(f==='title'?120:2000))throw Error(f+' is too long.');p[f]=input[f].trim()}const state=read();p.created=new Date().toISOString();state.proposals.unshift(p);state.draft=null;write(state);return p},vote(option){if(!options.includes(option))throw Error('Invalid poll option.');const state=read();if(state.vote)throw Error('This browser has already voted.');state.vote=option;write(state)},export(){return JSON.stringify({application:'Agora 0.6',scope:'This browser only',proposals:read().proposals},null,2)}};
}
function matchesText(query,value){const normal=v=>String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const hay=normal(value);return normal(query).trim().split(/\s+/).filter(Boolean).every(t=>hay.includes(t));}
const storyTopics=['Politics','Society','Economics','Technology','Environment','Culture','General'];
function storyTopic(story){if(storyTopics.includes(story.topic))return story.topic;const title=story.title||'';for(const [topic,words]of [['Technology',/\b(ai|technology|computer|chip|software|internet)\b/i],['Environment',/\b(climate|storm|flood|environment|wildfire|power)\b/i],['Economics',/\b(economy|economic|bank|market|inflation|trade|budget|business)\b/i],['Culture',/\b(art|music|film|book|museum|festival|theatre)\b/i],['Politics',/\b(election|president|parliament|minister|trump|putin|zelensky|government|war|houthi)\b/i],['Society',/\b(health|school|housing|education|community|police|prison|hospital|migration)\b/i]])if(words.test(title))return topic;return 'General';}
function parseReader(raw){
 if(typeof raw!=='string'||raw.length>2*1024*1024)throw Error('Use a reader backup up to2MB.');const d=JSON.parse(raw);
 const obj=x=>!!x&&typeof x==='object'&&!Array.isArray(x),str=(v,max,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw Error('Invalid reader field.');return v;},url=v=>{const u=new URL(str(v,2000,true));if(u.protocol!=='https:')throw Error('Links must use HTTPS.');return u.href;};
 if(!obj(d)||!obj(d.views)||!Array.isArray(d.discussions)||d.discussions.length>100)throw Error('Not an Agora reader backup.');const result={views:{},bookmarks:{},discussions:[],polls:[],interests:[]};
 if(Object.keys(d.views).length>500||!obj(d.bookmarks||{} )||Object.keys(d.bookmarks||{}).length>100)throw Error('Too many saved articles or views.');
 const safeKey=k=>{if(!/^[a-zA-Z0-9_-]{1,160}$/.test(k)||['__proto__','prototype','constructor'].includes(k))throw Error('Invalid article ID.');return k;};
 for(const [id,v]of Object.entries(d.views)){safeKey(id);result.views[id]={title:str(v.title,600,true),url:url(v.url),reaction:str(v.reaction,80,true),note:str(v.note||'',1000),savedAt:str(v.savedAt||'',80)};}
 for(const [id,v]of Object.entries(d.bookmarks||{})){safeKey(id);result.bookmarks[id]={id,title:str(v.title,600,true),url:url(v.url),topic:storyTopic(v),source:str(v.source||'Original source',160),publishedAt:v.publishedAt?str(v.publishedAt,80):null,savedAt:str(v.savedAt||'',80)};}
 const linked=v=>{const result={};if(v.storyId)result.storyId=safeKey(str(v.storyId,160,true));if(v.storyUrl)result.storyUrl=url(v.storyUrl);if(v.storyTitle)result.storyTitle=str(v.storyTitle,600);return result;};
 result.discussions=d.discussions.map(v=>({title:str(v.title,160,true),text:str(v.text,3000,true),createdAt:str(v.createdAt||'',80),...linked(v)}));
 if(!Array.isArray(d.polls||[])||(d.polls||[]).length>50||!Array.isArray(d.interests||[])||(d.interests||[]).length>50)throw Error('Invalid polls or interests.');
 result.polls=(d.polls||[]).map(v=>{if(v.vote!==null&&v.vote!==undefined&&!['Support','Oppose','Need more evidence'].includes(v.vote))throw Error('Invalid poll choice.');return {id:str(v.id,80,true),topic:str(v.topic,80,true),question:str(v.question,180,true),context:str(v.context,2000,true),vote:v.vote||null,createdAt:str(v.createdAt||'',80),...linked(v)};});result.interests=(d.interests||[]).map(v=>str(v,80,true));return result;
}
function selectStories(stories,views,{query='',savedOnly=false,topic='',bookmarks={}}={}){return stories.filter(s=>(!topic||storyTopic(s)===topic)&&(!savedOnly||Object.prototype.hasOwnProperty.call(views,s.id)||Object.prototype.hasOwnProperty.call(bookmarks,s.id))&&matchesText(query,s.title));}
function selectPolls(polls,{topic='',answer='all'}={}){return polls.filter(p=>(!topic||p.topic===topic)&&(answer==='all'||(answer==='answered'?!!p.vote:!p.vote)));}
const api={createStore,fields,options,matchesText,selectStories,selectPolls,storyTopic,storyTopics,parseReader};if(typeof module!=='undefined')module.exports=api;else root.Isegoria=api;
})(globalThis);
