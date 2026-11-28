import {Chess} from './vendor/chess.mjs';
const values={p:100,n:320,b:330,r:500,q:900,k:0};
export function chooseMove(fen,level='beginner'){
 const game=new Chess(fen),side=game.turn(),limits={beginner:[1,250],club:[2,1800],challenging:[3,6000]},[depth,budget]=limits[level]||limits.beginner;let nodes=0;
 function score(){if(game.isCheckmate())return game.turn()===side?-100000:100000;if(game.isDraw())return 0;return game.board().flat().reduce((s,p)=>s+(p?(p.color===side?1:-1)*values[p.type]:0),0);}
 function search(d,a,b){if(++nodes>budget||!d||game.isGameOver())return score();const max=game.turn()===side;let best=max?-Infinity:Infinity;for(const m of ordered()){game.move(m);const s=search(d-1,a,b);game.undo();best=max?Math.max(best,s):Math.min(best,s);if(max)a=Math.max(a,best);else b=Math.min(b,best);if(b<=a||nodes>budget)break;}return best;}
 function ordered(){return game.moves({verbose:true}).sort((a,b)=>(values[b.captured]||0)-(values[a.captured]||0));}
 let best=-Infinity,choice=null;for(const m of ordered()){game.move(m);const s=search(depth-1,-Infinity,Infinity);game.undo();if(s>best){best=s;choice={from:m.from,to:m.to,promotion:m.promotion||'q'};}}return choice;
}
