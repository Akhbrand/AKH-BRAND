import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
apiKey: "AIzaSyBpFVpOyPfS9C7b8Hit2NpAtcK4k-DeTPw",
authDomain: "akh-brand.firebaseapp.com",
projectId: "akh-brand",
storageBucket: "akh-brand.firebasestorage.app",
messagingSenderId: "671562968837",
appId: "1:671562968837:web:06557b3ab756696cf5116c"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



const productId = new URLSearchParams(location.search).get("id");

const box = document.getElementById("productPage");



const snapshot = await getDocs(collection(db,"products"));

let found = false;



snapshot.forEach(doc=>{


let product = doc.data();



if(product.code == productId){


found = true;



let imgs = Array.isArray(product.image)
?
product.image.filter(img=>img && img.trim()!=="")
:
[product.image];



let galleryImages = "";
let thumbnails = "";



imgs.forEach((img,index)=>{


let imagePath =
img.startsWith("http")
?
img
:
"./images/" + img;



galleryImages += `

<img 
src="${imagePath}"
class="mainProductImage ${index===0?"activeImage":""}"
id="image${index}">

`;



thumbnails += `

<img 
src="${imagePath}"
onclick="changeImage(${index})">

`;



});





box.innerHTML = `


<div class="singleProduct">



<div class="productGallery">


<div class="mainImageBox">

${galleryImages}

</div>



<div class="thumbs">

${thumbnails}

</div>


</div>





<div class="productDetails">


<h1>
${product.name}
</h1>



<div class="price">
${product.price}
</div>



<p>
الخامة: ${product.material}
</p>



<p>
المقاس: ${product.size}
</p>



<p>
الكود: ${product.code}
</p>



<p>
${product.description || ""}
</p>




<button class="cartBtn"
onclick='addToCart(${JSON.stringify(product)})'>

🛒 أضف للسلة

</button>




<a class="btn"
href="https://wa.me/201097521334?text=أريد طلب ${product.name}">

اطلب واتساب

</a>



</div>



</div>


`;



}



});





window.changeImage=function(index){


document.querySelectorAll(".mainProductImage")
.forEach(img=>{

img.classList.remove("activeImage");

});


document
.getElementById("image"+index)
.classList.add("activeImage");


};





if(!found){

box.innerHTML=`

<h2 style="text-align:center;margin-top:100px">

المنتج غير موجود

</h2>

`;

}
window.addToCart = function(product){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let existing = cart.find(
item => item.code === product.code
);

if(existing){

existing.quantity =
(existing.quantity || 1) + 1;

}else{

product.quantity = 1;

cart.push(product);

}

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

alert("✅ تم إضافة المنتج للسلة");

};
