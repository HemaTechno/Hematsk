import {
db,
storage,
collection,
addDoc,
getDoc,
doc,
updateDoc,
ref,
uploadBytes,
getDownloadURL
} from "./firebase.js";

const params = new URLSearchParams(location.search);
const editId = params.get("edit");

const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const rewardInput = document.getElementById("rewardLink");
const tasksContainer = document.getElementById("tasksContainer");

let existingImage = "";
let taskData = null;

// لو تعديل
if(editId){
loadEdit();
}

async function loadEdit(){

const snap = await getDoc(doc(db,"tasks",editId));

if(!snap.exists()) return;

taskData = snap.data();

titleInput.value = taskData.title;
descInput.value = taskData.description;
rewardInput.value = taskData.rewardLink;
existingImage = taskData.image || "";

// تحميل المهام القديمة
taskData.tasks.forEach(t=>{
addTask(t.name, t.link);
});

}

window.addTask = function(name="", link=""){

const div = document.createElement("div");
div.className = "task";

div.innerHTML = `
<input class="taskName" placeholder="اسم المهمة" value="${name}">
<input class="taskLink" placeholder="رابط المهمة" value="${link}">
`;

tasksContainer.appendChild(div);

};

window.saveTask = async function(){

let imageUrl = existingImage;

const imageFile = document.getElementById("image").files[0];

if(imageFile){

const imageRef = ref(storage,"images/"+Date.now());

await uploadBytes(imageRef,imageFile);

imageUrl = await getDownloadURL(imageRef);

}

const tasks = [];

document.querySelectorAll(".task").forEach(t=>{

const name = t.querySelector(".taskName").value;
const link = t.querySelector(".taskLink").value;

if(name && link){
tasks.push({name, link});
}

});

const data = {
title: titleInput.value,
description: descInput.value,
rewardLink: rewardInput.value,
image: imageUrl,
tasks,
createdAt: Date.now()
};

// لو تعديل
if(editId){
await updateDoc(doc(db,"tasks",editId), data);
alert("تم التعديل");
location.href = "admin.html";
return;
}

// إنشاء جديد
await addDoc(collection(db,"tasks"), data);

alert("تم الحفظ");
location.reload();

};
