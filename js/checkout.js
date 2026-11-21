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

const totalItems = document.getElementById("totalItems");



let total = 0;

let itemsCount = 0;



let html = "";



cart.forEach(product=>{


let image = Array.isArray(product.image)
?
product.image[0]
:
product.image;



if(image && !image.startsWith("http")){

image="./images/"+image;

}



let price = Number(
String(product.price).replace(/[^\d.]/g,"")
)||0;



let qty = product.quantity || 1;


total += price * qty;

itemsCount += qty;



html += `

<div class="orderCard">


<img src="${image}">


<div class="orderInfo">

<h3>${product.name}</h3>

<p>السعر: ${price} EGP</p>

<p>الكمية: ${qty}</p>

<p>المقاس: ${product.size}</p>


</div>


</div>

`;



});



orderItems.innerHTML = html;


totalPrice.innerText = total+" EGP";


totalItems.innerText = itemsCount;







document.getElementById("sendOrder").onclick = async()=>{


let name =
document.getElementById("customerName").value.trim();


let phone =
document.getElementById("customerPhone").value.trim();



let governorate =
document.getElementById("customerGovernorate").value;



let city =
document.getElementById("customerCity").value.trim();



let address =
document.getElementById("customerAddress").value.trim();



let notes =
document.getElementById("customerNotes").value.trim();



let payment =
document.querySelector(
'input[name="payment"]:checked'
).value;



if(
!name ||
!phone ||
!governorate ||
!city ||
!address
){

AKH.toast("من فضلك اكملي كل البيانات المطلوبة","warn");

return;

}

if(!/^01[0125]\d{8}$/.test(phone.replace(/\s/g,""))){

AKH.toast("رقم الهاتف غير صحيح (مثال: 01012345678)","warn");

return;

}

if(!cart.length){

AKH.toast("السلة فارغة","warn");

return;

}

const sendBtn=document.getElementById("sendOrder");

sendBtn.disabled=true;

sendBtn.textContent="جاري إرسال الطلب...";



let orderNumber =
"AKH-" + Date.now();



try{


await addDoc(
collection(db,"orders"),
{


orderNumber,


customerName:name,

customerPhone:phone,

governorate,

city,

address,

notes,

payment,


products:cart,


total,

totalItems:itemsCount,


status:"جاري المراجعة",


createdAt:new Date().toISOString()


}

);



localStorage.removeItem("cart");



sessionStorage.setItem("lastOrder",orderNumber);



window.location.href =
"order-tracking.html?phone="+phone;



}

catch(error){


console.log(error);


AKH.toast("حدث خطأ، حاولي مرة أخرى","warn");

sendBtn.disabled=false;

sendBtn.textContent="✅ تأكيد الطلب";


}



};
