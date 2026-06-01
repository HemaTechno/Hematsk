import { db, doc, getDoc } from "./firebase.js";

const id = new URLSearchParams(location.search).get("id");

const content = document.getElementById("content");

let data;
let done = new Set();

const DAILY_LIMIT = 3;

// تاريخ اليوم
function today(){
return new Date().toISOString().split("T")[0];
}

// مفتاح المكافأة اليومي
function rewardKey(){
return "reward_" + id + "_" + today();
}

// عداد الاستخدام اليومي
function countKey(){
return "count_" + today();
}

async function load(){

const snap = await getDoc(doc(db,"tasks",id));

if(!snap.exists()){
content.innerHTML = "<h2>المهمة غير موجودة</h2>";
return;
}

data = snap.data();

render();

}

function render(){

let html = `
<div class="card">

<h2>${data.title}</h2>
<p>${data.description || ""}</p>

${data.image ? `<img src="${data.image}">` : ""}

<h3>المهام</h3>
`;

data.tasks.forEach((t,i)=>{

html += `
<div class="task">
<b>${t.name}</b>

<button class="open" onclick="run('${t.link}', ${i}, this)">
فتح
</button>

</div>
`;

});

html += `
<button class="done" onclick="unlock()">
فتح المكافأة
</button>

</div>
`;

content.innerHTML = html;

}

// 🔥 فتح المهمة + تشغيل العداد بعد الفتح
window.run = function(link, i, btn){

if(done.has(i)) return;

// 1) افتح الرابط فورًا
window.open(link, "_blank");

// 2) شغل العداد بعد الفتح
btn.disabled = true;

let time = 10;

btn.innerText = "جارٍ التحقق " + time;

const interval = setInterval(()=>{

time--;

btn.innerText = "انتظر " + time + " ثانية";

if(time <= 0){

clearInterval(interval);

// تسجيل المهمة
done.add(i);

btn.innerText = "تم التنفيذ";
btn.style.background = "#16a34a";
}

},1000);

};

// 🔥 فتح المكافأة مع الحماية
window.unlock = function(){

// لازم كل المهام تخلص
if(done.size !== data.tasks.length){
alert("لازم تكمل كل المهام");
return;
}

// حد يومي
let count = parseInt(localStorage.getItem(countKey()) || "0");

if(count >= DAILY_LIMIT){
alert("وصلت الحد اليومي (3 مرات)");
return;
}

// منع التكرار في نفس اليوم
if(localStorage.getItem(rewardKey())){
alert("أخذت المكافأة اليوم بالفعل");
return;
}

// تسجيل الاستخدام
localStorage.setItem(rewardKey(), "1");
localStorage.setItem(countKey(), count + 1);

// تحويل للمكافأة
window.location.href = data.rewardLink;

};

load();
