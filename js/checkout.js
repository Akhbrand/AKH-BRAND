import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyBpFVpOyPfS9C7b8Hit2NpAtcK4k-DeTPw",

authDomain: "akh-brand.firebaseapp.com",

projectId: "akh-brand",

storageBucket: "akh-brand.firebasestorage.app",

messagingSenderId: "671562968837",

appId: "1:671562968837:web:06557b3ab756696cf5116c",

measurementId: "G-L1HPJ8PYMJ"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("sendOrder").onclick = async () => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0){
        alert("🛒 السلة فارغة");
        return;
    }

    const order = {

        customerName: document.getElementById("customerName").value,

        customerPhone: document.getElementById("customerPhone").value,

        customerAddress: document.getElementById("customerAddress").value,

        customerNotes: document.getElementById("customerNotes").value,

        products: cart,

        createdAt: new Date().toISOString(),

        status: "جديد"

    };

    await addDoc(collection(db,"orders"), order);

    localStorage.removeItem("cart");

    alert("✅ تم إرسال الطلب بنجاح");

    window.location.href = "index.html";

};
