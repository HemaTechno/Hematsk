import {
db,
storage,
collection,
addDoc,
ref,
uploadBytes,
getDownloadURL
} from "./firebase.js";

const tasksContainer = document.getElementById("tasksContainer");

window.addTask = function(){

const div = document.createElement("div");

div.className = "task";

div.innerHTML = `
<input class="taskName" placeholder="اسم المهمة">
<input class="taskLink" placeholder="رابط المهمة">
`;

tasksContainer.appendChild(div);

};

addTask();

window.saveTask = async function(){

const title =
document.getElementById("title").value;

const description =
document.getElementById("description").value;

const rewardLink =
document.getElementById("rewardLink").value;

const imageFile =
document.getElementById("image").files[0];

let imageUrl = "";

if(imageFile){

const imageRef = ref(
storage,
"images/" + Date.now()
);

await uploadBytes(
imageRef,
imageFile
);

imageUrl =
await getDownloadURL(imageRef);

}

const tasks = [];

document
.querySelectorAll(".task")
.forEach(task=>{

const name =
task.querySelector(".taskName").value;

const link =
task.querySelector(".taskLink").value;

if(name && link){

tasks.push({
name,
link
});

}

});

await addDoc(
collection(db,"tasks"),
{
title,
description,
rewardLink,
image:imageUrl,
tasks,
createdAt:Date.now()
}
);

alert("تم الحفظ");

location.reload();

};
