import { db, doc, getDoc } from "./firebase.js";

const id = new URLSearchParams(location.search).get("id");

let data;
let done = new Set();

const DAILY_LIMIT = 3;

function today(){
return new Date().toISOString().split("T")[0];
}

function key(){
return "reward_" + id + "_" + today();
}

function countKey(){
return "count_" + today();
}

async function load(){

const snap = await getDoc(doc(db,"tasks",id));
data = snap.data();

render();
}

function render(){

let html = `<div class="card">
<h2>${data.title}</h2>
<p>${data.description||""}</p>
${data.image?`<img src="${data.image}" width="100%">`:""}
<h3>المهام</h3>`;

data.tasks.forEach((t,i)=>{

html += `
<div class="task">
<b>${t.name}</b>
<button class="open" onclick="run('${t.link}',${i},this)">فتح</button>
</div>
`;

});

html += `<button class="done" onclick="unlock()">المكافأة</button></div>`;

content.innerHTML = html;
}

window.run = function(link,i,btn){

if(done.has(i)) return;

btn.disabled=true;
let t=10;

btn.innerText=t;

let x=setInterval(()=>{

t--;
btn.innerText=t;

if(t<=0){
clearInterval(x);
window.open(link,"_blank");
done.add(i);
btn.innerText="تم";
}

},1000);

};

window.unlock = function(){

if(done.size !== data.tasks.length){
alert("كمل كل المهام");
return;
}

// daily limit
let c = parseInt(localStorage.getItem(countKey())||"0");

if(c >= DAILY_LIMIT){
alert("وصلت الحد اليومي");
return;
}

if(localStorage.getItem(key())){
alert("اخدت المكافأة اليوم");
return;
}

localStorage.setItem(key(),"1");
localStorage.setItem(countKey(),c+1);

location.href=data.rewardLink;

};

load();
