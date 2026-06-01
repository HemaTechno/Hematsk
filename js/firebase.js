// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBoPJbx5v6EkOqxOJkbhzHqIJdAByh79Rg",
    authDomain: "hhhhhh-d4fb8.firebaseapp.com",
    databaseURL: "https://hhhhhh-d4fb8-default-rtdb.firebaseio.com",
    projectId: "hhhhhh-d4fb8",
    storageBucket: "hhhhhh-d4fb8.appspot.com",
    messagingSenderId: "24512338206",
    appId: "1:24512338206:web:dfe045db59bd3434a2110f",
    measurementId: "G-HD4R7GNQ5H"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export {
    db,
    storage,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    ref,
    uploadBytes,
    getDownloadURL
};
