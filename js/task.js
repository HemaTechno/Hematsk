import { db, doc, getDoc } from "./firebase.js";

const id = new URLSearchParams(location.search).get("id");

const content = document.getElementById("content");

let data;
let done = new Set();

let captchaPassed = false;

// تحميل المهمة
async function load(){

const snap = await getDoc(doc(db,"tasks",id));

if(!snap.exists()){
content.innerHTML="Not Found";
return;
}

data = snap.data();
render();

}

function render(){

let html = `
<div class="card">

<h2>${data.title}</h2>
<p>${data.description||""}</p>

${data.image?`<img src="${data.image}" width="100%">`:""}

<h3>المهام</h3>
`;

data.tasks.forEach((t,i)=>{

html += `
<div class="task">
<b>${t.name}</b>
<button class="open" onclick="run('${t.link}',${i},this)">فتح</button>
</div>
`;

});

html += `
<div id="captchaBox"></div>

<button class="done" onclick="unlock()">
تخطي الرابط
</button>

</div>
`;

content.innerHTML = html;

}

// 🔥 فتح المهمة + عداد 10 ثواني بعد الفتح
window.run = function(link,i,btn){

if(done.has(i)) return;

window.open(link,"_blank");

btn.disabled = true;

let t = 10;

btn.innerText = "انتظر " + t;

let x = setInterval(()=>{

t--;
btn.innerText = t;

if(t <= 0){
clearInterval(x);

done.add(i);

btn.innerText = "تم";
btn.style.background = "#16a34a";
}

},1000);

};

// 🔥 زر المكافأة
window.unlock = function(){

if(done.size !== data.tasks.length){
alert("كمل كل المهام");
return;
}

// كابتشا
if(!captchaPassed){

document.getElementById("captchaBox").innerHTML = `
<div class="g-recaptcha"
data-sitekey="6LewDAgtAAAAACKRpgpu_e9N-YqscgWGb3YCk3GA"
data-callback="onCaptchaSuccess"></div>
`;

setTimeout(()=>{
if(window.grecaptcha){
grecaptcha.render(document.querySelector(".g-recaptcha"));
}
},500);

return;
}

goReward();

};

// نجاح الكابتشا
window.onCaptchaSuccess = function(){
captchaPassed = true;
unlock();
};

// المكافأة النهائية
function goReward(){

// بدون أي ليمت نهائيًا

window.location.href = data.rewardLink;

}

load();
