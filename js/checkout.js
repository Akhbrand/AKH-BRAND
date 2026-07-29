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

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderItems = document.getElementById("orderItems");
const totalPrice = document.getElementById("totalPrice");

let total = 0;

if(cart.length === 0){

    orderItems.innerHTML = "<p>🛒 السلة فارغة</p>";

}else{

    cart.forEach(product=>{

        const image = Array.isArray(product.image)
            ? product.image[0]
            : product.image;

        const price = parseFloat(
            String(product.price).replace(/[^\d.]/g,"")
        ) || 0;

        total += price;

        orderItems.innerHTML += `
        <div class="orderCard">

            <img src="${image}" alt="${product.name}">

            <div class="orderInfo">

                <h3>${product.name}</h3>

                <p>${product.price}</p>

                <p>المقاس: ${product.size}</p>

            </div>

        </div>
        `;

    });

}

totalPrice.innerHTML = total + " EGP";

document.getElementById("sendOrder").onclick = async ()=>{

    if(cart.length===0){
        alert("السلة فارغة");
        return;
    }

    const payment =
    document.querySelector('input[name="payment"]:checked').value;

    const order={

        customerName:
        document.getElementById("customerName").value,

        customerPhone:
        document.getElementById("customerPhone").value,

        governorate:
        document.getElementById("customerGovernorate").value,

        city:
        document.getElementById("customerCity").value,

        address:
        document.getElementById("customerAddress").value,

        notes:
        document.getElementById("customerNotes").value,

        payment,

        products:cart,

        total,

        status:"جديد",

        createdAt:new Date().toISOString()

    };

    await addDoc(collection(db,"orders"),order);

    localStorage.removeItem("cart");

    alert("✅ تم إرسال الطلب بنجاح");

    window.location.href="index.html";

};
