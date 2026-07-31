import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   FIREBASE
========================= */

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

/* =========================
   ELEMENTS
========================= */

const productsBox =
document.getElementById("products");

const searchInput =
document.getElementById("searchInput");

const cartCount =
document.getElementById("cartCount");

const favCount =
document.getElementById("favCount");

/* =========================
   LOCAL STORAGE
========================= */

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

let favorites =
JSON.parse(localStorage.getItem("favorites")) || [];

/* =========================
   COUNTERS
========================= */

function updateCartCount(){

let total = 0;

cart.forEach(item=>{

total += item.quantity || 1;

});

if(cartCount){

cartCount.innerHTML = total;

}

}

function updateFavoriteCount(){

if(favCount){

favCount.innerHTML = favorites.length;

}

}

updateCartCount();

updateFavoriteCount();

/* =========================
   TOAST
========================= */

function showToast(message,type="success"){

const toast =
document.getElementById("toast");

if(!toast) return;

toast.className =
"toast " + type;

toast.innerHTML = message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2200);

}

function showToast(message){

const toast =
document.getElementById("toast");

if(!toast) return;

toast.innerHTML = message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2200);

}
/* =========================
   OPEN PRODUCT
========================= */

window.openProduct = function(code){

location.href =
"product.html?id="+code;

};
/* =========================
   ADD TO CART
========================= */

window.addToCart = function(product){

let existing =
cart.find(item=>item.code===product.code);

if(existing){

existing.quantity =
(existing.quantity || 1)+1;

}else{

product.quantity = 1;

cart.push(product);

}

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCartCount();

showToast("🛒 تم إضافة المنتج للسلة");
};

/* =========================
   FAVORITES
========================= */

window.toggleFavorite = function(product){

const index =
favorites.findIndex(
item=>item.code===product.code
);

if(index>-1){

favorites.splice(index,1);

}else{

favorites.push(product);

}

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

updateFavoriteCount();

document.querySelectorAll(".favoriteBtn")
.forEach(btn=>{

if(btn.dataset.code===product.code){

const active =
favorites.some(
item=>item.code===product.code
);

btn.classList.toggle(
"favoriteActive",
active
);

btn.innerHTML =
active
?
"❤️"
:
"🤍";

}

});

};

/* =========================
   LOAD PRODUCTS
========================= */

const snapshot =
await getDocs(
collection(db,"products")
);

snapshot.forEach(doc=>{

const product = doc.data();

let images = "";

let dots = "";

const imgs =
Array.isArray(product.image)
?
product.image.filter(
img=>img && img.trim()!==""
)
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
<img
src="${imagePath}"
loading="lazy"
alt="${product.name}">
`;

dots += `
<span class="dot ${index===0?"active":""}"></span>
`;

});

const isFavorite =
favorites.some(
item=>item.code===product.code
);

productsBox.innerHTML += `

<div class="card"

onclick="openProduct('${product.code}')">

<div

class="favoriteBtn ${isFavorite?"favoriteActive":""}"

data-code="${product.code}"

onclick='event.stopPropagation();toggleFavorite(${JSON.stringify(product)})'>

${isFavorite ? "❤️" : "🤍"}

</div>

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

Code : ${product.code}

</p>

<button

class="cartBtn"

onclick='event.stopPropagation();addToCart(${JSON.stringify(product)})'>

🛒 أضف للسلة

</button>

<a

class="btn"

onclick="event.stopPropagation()"

href="https://wa.me/201097521334?text=مرحباً، أريد طلب ${product.name} - كود ${product.code}">

اطلب الآن واتساب

</a>

</div>

</div>

`;

});
/* =========================
   SEARCH
========================= */

if(searchInput){

searchInput.addEventListener("input",function(){

const value =
this.value.toLowerCase().trim();

document.querySelectorAll(".card")
.forEach(card=>{

const text =
card.innerText.toLowerCase();

card.style.display =
text.includes(value)
?
""
:
"none";

});

});

}

/* =========================
   SIMPLE IMAGE SLIDER
========================= */

document.querySelectorAll(".slider").forEach(slider=>{

const images =
slider.querySelectorAll("img");

if(images.length<=1) return;

let current = 0;

images.forEach((img,index)=>{

img.style.display =
index===0
?
"block"
:
"none";

});

setInterval(()=>{

images[current].style.display="none";

current++;

if(current>=images.length){

current=0;

}

images[current].style.display="block";

},2500);

});

/* =========================
   UPDATE COUNTERS
========================= */

updateCartCount();

updateFavoriteCount();
