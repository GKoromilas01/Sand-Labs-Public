import {chooseMove} from './engine.mjs';
self.onmessage=({data})=>{try{self.postMessage({id:data.id,fen:data.fen,move:chooseMove(data.fen,data.level)});}catch(error){self.postMessage({id:data.id,error:error.message});}};
