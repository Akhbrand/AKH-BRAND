import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const box = document.getElementById("products");

const querySnapshot = await getDocs(collection(db,"products"));

querySnapshot.forEach((doc)=>{

let product = doc.data();

let images = "";
let dots = "";

const imgs = Array.isArray(product.image)
?
product.image.filter(img=>img && img.trim()!=="")
:
[product.image];

imgs.forEach((img,index)=>{

const imagePath =
(typeof img==="string" && img.startsWith("http"))
?
img
:
"./images/"+img;

images += `
<img src="${imagePath}" loading="lazy" alt="${product.name}">
`;

dots += `
<span class="dot ${index===0?"active":""}"></span>
`;

});

box.innerHTML += `

<div class="card"
onclick="openProduct('${product.code}')">

<div class="gallery">

<div class="slider">

${images}

</div>

<div class="dots">

${dots}

</div>

</div>

<div class="info">

<h2>
${product.name}
</h2>

<div class="price">
${product.price}
</div>

<p class="productCode">
Code: ${product.code}
</p>

<button class="cartBtn"
onclick='event.stopPropagation(); addToCart(${JSON.stringify(product)})'>

🛒 أضف للسلة

</button>

<a class="btn"
onclick="event.stopPropagation()"
href="https://wa.me/201097521334?text=مرحباً، أريد طلب ${product.name} - كود ${product.code}">

اطلب الآن واتساب

</a>

</div>

</div>

`;

});

window.openProduct = function(code){

window.location.href = "product.html?id=" + code;

};

window.addToCart = function(product){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let existing = cart.find(item => item.code === product.code);

if(existing){

existing.quantity = (existing.quantity || 1) + 1;

}else{

product.quantity = 1;

cart.push(product);

}

localStorage.setItem("cart", JSON.stringify(cart));

alert("✅ تم إضافة المنتج للسلة");

updateCartCount();

};

function updateCartCount(){

const cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;

cart.forEach(item=>{

total += item.quantity || 1;

});

let count = document.getElementById("cartCount");

if(count){

count.innerText = total;

}

}

updateCartCount();
