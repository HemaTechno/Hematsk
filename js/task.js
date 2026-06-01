import { db, doc, getDoc } from "./firebase.js";

const id = new URLSearchParams(location.search).get("id");

const content = document.getElementById("content");

let data;
let done = new Set();
let captchaPassed = false;

// تحميل البيانات
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
<button class="open" onclick="run('${t.link}',${i},this)">
فتح
</button>
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

// 🔥 CPA VERIFICATION SYSTEM
window.run = function(link,i,btn){

if(done.has(i)) return;

// فتح الرابط فورًا
window.open(link,"_blank");

btn.disabled = true;

let time = 10;
let progress = 0;

// شكل CPA
btn.innerHTML = `
<div class="spinner"></div>
<div>جاري التحقق من النشاط</div>
<small>${time}s</small>

<div class="bar">
<div class="fill"></div>
</div>
`;

const fill = btn.querySelector(".fill");
const small = btn.querySelector("small");

let x = setInterval(()=>{

time--;
progress += 10;

small.innerText = time + "s";
fill.style.width = progress + "%";

if(time <= 0){
clearInterval(x);

done.add(i);

// نجاح
btn.innerHTML = "✅ تم التحقق";
btn.style.background = "#16a34a";

// 🔊 صوت النجاح
const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3");
audio.play();
}

},1000);

};

// 🔐 Unlock reward
window.unlock = function(){

if(done.size !== data.tasks.length){
alert("كمل كل المهام");
return;
}

// CAPTCHA
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

// CAPTCHA success
window.onCaptchaSuccess = function(){
captchaPassed = true;
unlock();
};

// reward redirect
function goReward(){

window.location.href = data.rewardLink;

}

load();
