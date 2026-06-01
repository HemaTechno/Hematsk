import {
db,
collection,
getDocs,
deleteDoc,
doc
} from "./firebase.js";

window.login = function(){

const pass =
document.getElementById("password").value;

if(pass !== "Hema@2007"){
alert("كلمة المرور غير صحيحة");
return;
}

document.getElementById("loginBox").style.display = "none";
document.getElementById("panel").style.display = "block";

loadTasks();

};

async function loadTasks(){

const list =
document.getElementById("tasksList");

list.innerHTML = "";

const querySnapshot =
await getDocs(collection(db,"tasks"));

querySnapshot.forEach((item)=>{

const data = item.data();

const pageUrl =
`${location.origin}/task.html?id=${item.id}`;

const div =
document.createElement("div");

div.className = "card";

div.innerHTML = `
<h3>${data.title}</h3>

<p>${data.description || ""}</p>

<div class="actions">

<button
class="copy"
onclick="copyLink('${pageUrl}')">
نسخ الرابط
</button>

<button
class="edit"
onclick="editTask('${item.id}')">
تعديل
</button>

<button
class="delete"
onclick="removeTask('${item.id}')">
حذف
</button>

</div>
`;

list.appendChild(div);

});

}

window.copyLink = function(link){

navigator.clipboard.writeText(link);

alert("تم نسخ الرابط");

};

window.removeTask = async function(id){

const ok =
confirm("هل تريد حذف الصفحة؟");

if(!ok) return;

await deleteDoc(
doc(db,"tasks",id)
);

loadTasks();

};

window.editTask = function(id){

location.href =
`create.html?edit=${id}`;

};
