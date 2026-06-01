import {
db,
doc,
getDoc
} from "./firebase.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");

const content = document.getElementById("content");

let taskData = null;
let completedTasks = new Set();

async function loadTask(){

const snap =
await getDoc(doc(db,"tasks",id));

if(!snap.exists()){
content.innerHTML = "<h2>المهمة غير موجودة</h2>";
return;
}

taskData = snap.data();

render();

}

function render(){

let html = "";

html += `
<div class="card">

<h2>${taskData.title}</h2>

<p>${taskData.description || ""}</p>

${taskData.image ? `<img src="${taskData.image}">` : ""}

<h3>المهام</h3>
`;

taskData.tasks.forEach((t, index)=>{

const done =
completedTasks.has(index);

html += `
<div class="task">

<div>
<b>${t.name}</b>
</div>

<div>
<button class="open" onclick="openTask('${t.link}', ${index})">
فتح
</button>
</div>

</div>
`;

});

html += `
<button class="done" onclick="unlockReward()">
تم تنفيذ كل المهام
</button>

</div>
`;

content.innerHTML = html;

}

window.openTask = function(link, index){

window.open(link, "_blank");

completedTasks.add(index);

render();

};

window.unlockReward = function(){

if(completedTasks.size !== taskData.tasks.length){
alert("يجب تنفيذ كل المهام أولاً");
return;
}

window.location.href = taskData.rewardLink;

};

loadTask();
