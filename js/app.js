

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

const imgs = Array.isArray(product.image) ? product.image : [product.image];

imgs.forEach((img,index)=>{

const imagePath =
    (typeof img === "string" && img.startsWith("http"))
    ? img
    : "./images/" + img;

images += `
    <img src="${imagePath}" loading="lazy" alt="${product.name}">
`;

dots += `
    <span class="dot ${index==0?"active":""}"></span>
`;
});

images = `
<div class="gallery">

<div class="slider">

    ${images}

</div>


<div class="dots">

    ${dots}

</div>
</div>
`;






box.innerHTML += `

<div class="card">

${images}

<div class="info">


<h2>${product.name}</h2>


<div class="price">

${product.price}

</div>


<p>الخامة: ${product.material}</p>

<p>المقاس: ${product.size}</p>

<p>الكود: ${product.code}</p>


<p>
${product.description || ""}
</p>


<button class="cartBtn"
onclick='addToCart(${JSON.stringify(product)})'> 
🛒 أضف للسلة 
</button>


<a class="btn"

href="https://wa.me/201097521334?text=مرحباً، أريد طلب ${product.name} - كود ${product.code}">

اطلب الآن واتساب

</a>


</div>

</div>

`;

});

document.querySelectorAll(".gallery").forEach(gallery=>{

const slider = gallery.querySelector(".slider");

const dots = gallery.querySelectorAll(".dot");

let index = 0;

let startX = 0;
let endX = 0;

gallery.addEventListener("touchstart", e=>{ 
startX = e.touches[0].clientX; 
});

gallery.addEventListener("touchend", e=>{ 
endX = e.changedTouches[0].clientX; 
if(startX - endX > 50){ 
showSlide(index + 1); 
}

if(endX - startX > 50){ 
showSlide(index - 1); 
} 
});

function showSlide(i){

    if(i < 0) i = dots.length - 1;
    if(i >= dots.length) i = 0;

    index = i;

    slider.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot=>dot.classList.remove("active"));
    dots[index].classList.add("active");

}



dots.forEach((dot,i)=>{
    dot.onclick = ()=>showSlide(i);
});
});

window.addToCart = function(product){
let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.push(product);

localStorage.setItem("cart", JSON.stringify(cart));

alert("✅ تم إضافة المنتج للسلة");

}
