"use strict";
const rules=["All four identical · 1111","Three identical or two pairs · 1112 / 1133","Exactly one pair · 1123","All digits different · 1234"];
const pattern={4:0,31:1,22:1,211:2,1111:3};
const levelOf=n=>/^[1-9][0-9]{3}$/.test(n)?pattern[Object.values([...n].reduce((a,d)=>(a[d]=(a[d]||0)+1,a),{})).sort((a,b)=>b-a).join("")]:undefined;
const pools=Array.from({length:4},()=>[]);
for(let n=1000;n<10000;n++) pools[levelOf(String(n))].push(String(n));
function marks(secret,guess){
 const counts={}, result=[...guess].map((g,i)=>g===secret[i]?"Green":"Red");
 [...secret].forEach((c,i)=>{if(result[i]!=="Green") counts[c]=(counts[c]||0)+1;});
 [...guess].forEach((c,i)=>{if(result[i]!=="Green" && counts[c]>0){counts[c]--;result[i]="Yellow";}});
 return result;
}
const app=document.querySelector("#app"), colors={Red:"#b02030",Yellow:"#795300",Green:"#006b3b"};
let mode,level,pool,secret,guess,clues,attempts,timer,done,submitted;
function view(html){clearTimeout(timer);timer=null;app.innerHTML=html;}
function scene(home=false){return '<div class="scene '+(home?'home':'')+'"><div class="bubble" role="status"></div><img alt="Game robot"></div>';}
function robot(pose,msg){app.querySelector(".scene img").src="assets/robot_"+pose+".png";app.querySelector(".bubble").textContent=msg;}
function menu(){view(scene(true)+'<div class="tiles"><button id="human">Human guesses</button><button id="computer">Computer guesses</button></div>');robot("hello","Who’s guessing today?");for(const id of ["human","computer"]) app.querySelector("#"+id).onclick=()=>{mode=id;levels();};}
function levels(){view('<nav><button id="modes">Modes</button></nav><h2>Choose a level</h2><div class="levels">'+rules.map((r,i)=>'<button data-level="'+i+'">Level '+(i+1)+' · '+r+'</button>').join("")+'</div>');app.querySelector("#modes").onclick=menu;app.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>{level=+b.dataset.level;start();});}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function start(){
 pool=pools[level].slice();secret=mode==="human"?pick(pool):null;guess=null;clues=[];attempts=0;done=submitted=false;
 view('<nav><button id="modes">Modes</button><button id="levels">Levels</button></nav><h2>'+(mode==="human"?"Human guesses":"Computer guesses")+' · Level '+(level+1)+'</h2><p>'+rules[level]+'</p><div class="boards '+mode+'"><section><h3>'+(mode==="human"?"Your guess":"Your secret")+'</h3><div class="digits" id="fields">'+Array.from({length:4},(_,i)=>'<input aria-label="Digit '+(i+1)+'" inputmode="numeric" autocomplete="off">').join("")+'</div></section>'+(mode==="computer"?'<section><h3>Computer’s guess</h3><div class="digits" id="computer"></div><p class="hint">Green: correct · Yellow: wrong place · Red: no match</p></section>':'')+'</div>'+scene()+'<p class="attempts" aria-live="polite">Attempts: 0</p>');
 app.querySelector("#modes").onclick=menu;app.querySelector("#levels").onclick=levels;
 robot(mode==="human"?"human_thinking":"hello",mode==="human"?"I've thought of a number; can you guess what it is?":"Hello, let's play a game: you think of a number, and I'll try to guess it.");
 const fields=[...app.querySelectorAll("input")];
 function enter(index,raw){
  if(done || (mode==="computer" && secret)) return;
  const digits=raw.replace(/[^0-9]/g,"");if(!digits){fields[index].value="";return;}
  if(submitted){fields.forEach(f=>{f.value="";f.style.color="";});submitted=false;index=0;}
  [...digits.slice(0,4-index)].forEach((d,j)=>fields[index+j].value=d);
  const last=Math.min(index+digits.length,3);fields[last].focus();fields[last].select();
  const value=fields.map(f=>f.value).join("");if(value.length!==4)return;
  if(levelOf(value)!==level){fields.forEach(f=>f.value="");fields[0].focus();robot(mode==="human"?"human_thinking":"hello","Let's try again! Use four digits, no leading zero, and follow the level rule.");return;}
  if(mode==="computer"){secret=value;fields.forEach(f=>f.readOnly=true);next();return;}
  submitted=true;count();const feedback=marks(secret,value);fields.forEach((f,i)=>f.style.color=colors[feedback[i]]);fields[0].focus();fields[0].select();
  if(value===secret)win();else robot("human_thinking","No, the number you guessed was not the number I had in mind.");
 }
 fields.forEach((f,i)=>{
  f.addEventListener("input",()=>enter(i,f.value));
  f.addEventListener("keydown",e=>{if(/^[0-9]$/.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();enter(i,e.key);}else if(e.key==="Backspace"&&!f.value&&i>0){fields[i-1].focus();fields[i-1].select();}});
  f.addEventListener("paste",e=>{e.preventDefault();enter(i,e.clipboardData.getData("text"));});
  f.addEventListener("focus",()=>f.select());
 });
 if(mode==="computer")lights();
}
function count(){app.querySelector(".attempts").textContent="Attempts: "+(++attempts);}
function lights(){
 const board=app.querySelector("#computer");board.innerHTML="";
 for(let i=0;i<4;i++){
  const cell=document.createElement("div"), digit=document.createElement("div"), box=document.createElement("div");
  digit.className="digit";digit.textContent=guess?.[i]??"–";digit.style.color=colors[clues[i]]||"inherit";box.className="lamps";
  for(const [name,fill] of [["Red","#e53935"],["Yellow","#ffdf00"],["Green","#16a34a"]]){
   const b=document.createElement("button");b.className="lamp";b.style.setProperty("--light",fill);b.setAttribute("aria-label","Digit "+(i+1)+": "+name);b.setAttribute("aria-pressed",clues[i]===name);b.disabled=!guess||done;
   b.onclick=()=>{if(timer||done)return;clues[i]=name;digit.style.color=colors[name];[...box.children].forEach(l=>l.setAttribute("aria-pressed",l===b));if(clues.filter(Boolean).length===4)timer=setTimeout(submit,450);};
   box.append(b);
  }
  cell.append(digit,box);board.append(cell);
 }
}
function next(){guess=pick(pool);clues=[];lights();robot("thinking","Is the number I guessed correct? If not, could you please give me a hint?");}
function submit(){timer=null;const left=pool.filter(n=>marks(n,guess).every((c,i)=>c===clues[i]));if(!left.length){robot("thinking","Hmm, those colors don't fit the clues so far. Could you check them and try again?");return;}count();if(clues.every(c=>c==="Green"))win();else{pool=left;next();}}
function win(){done=true;app.querySelectorAll("input,.lamp").forEach(e=>e.disabled=true);robot(mode==="human"?"human_celebrating":"celebrating",mode==="human"?"That was the number I had guessed—congratulations! Shall we play again?":"Yay, I finally found the right number!");timer=setTimeout(start,3000);}
menu();
