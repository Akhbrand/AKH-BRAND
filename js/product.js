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

const relatedBox =
document.getElementById("relatedProducts");

snapshot.forEach(doc=>{


let product = doc.data();



if(product.code == productId){


found = true;
document.title = product.name + " | AKH BRAND";



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
class="thumb ${index===0?"on":""}"
onclick="changeImage(${index})">

`;



});





box.innerHTML = `


<div class="singleProduct">



<div class="productGallery">


<div class="mainImageBox">

${product.available === false ? `
<div class="soldOutBadge">
SOLD OUT
</div>
` : ``}

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



<div class="productInfoBox">

<div class="infoItem">

<span>📦 الخامة</span>

<strong>${product.material}</strong>

</div>

<div class="infoItem">

<span>📏 المقاس</span>

<strong>${product.size}</strong>

</div>

<div class="infoItem">

<span>🏷 الكود</span>

<strong>${product.code}</strong>

</div>

<div class="infoItem">

<span>🚚 الشحن</span>

<strong>جميع المحافظات</strong>

</div>

</div>

<div class="descriptionBox">

<h3>

📝 وصف المنتج

</h3>

<p>

${product.description || "لا يوجد وصف."}

</p>

</div>




${product.available === false
? `
<button
class="cartBtn soldBtn"
disabled>
❌ نفد المخزون
</button>
`
: `
<button
class="cartBtn"
onclick='addToCart(${JSON.stringify(product)})'>
🛒 أضف للسلة
</button>
`
}




<button class="favWide" onclick='toggleFav(${JSON.stringify(product)},this)'>
${AKH.get("favorites").some(f=>String(f.code)===String(product.code))?"❤️ في المفضلة":"🤍 أضف للمفضلة"}
</button>

<a class="btn"
href="https://wa.me/201097521334?text=${encodeURIComponent("أريد طلب "+product.name+" - كود "+product.code)}">

اطلب واتساب

</a>



</div>



</div>


`;



}



});





window.toggleFav=function(prod,btn){
const f=AKH.get("favorites"), i=f.findIndex(x=>String(x.code)===String(prod.code));
if(i>-1){f.splice(i,1);btn.textContent="🤍 أضف للمفضلة";AKH.toast("تمت الإزالة من المفضلة","warn");}
else{f.push(prod);btn.textContent="❤️ في المفضلة";AKH.toast("❤️ تمت الإضافة للمفضلة");}
AKH.set("favorites",f);
};

window.changeImage=function(index){


document.querySelectorAll(".mainProductImage")
.forEach(img=>{

img.classList.remove("activeImage");

});


document
.getElementById("image"+index)
.classList.add("activeImage");

document.querySelectorAll(".thumbs img")
.forEach((t,k)=>t.classList.toggle("on",k===index));


};





if(!found){

box.innerHTML=`

<h2 style="text-align:center;margin-top:100px">

المنتج غير موجود

</h2>

`;

}
/* ==========================
   RELATED PRODUCTS
========================== */

let relatedHTML = "";

let count = 0;

snapshot.forEach(doc=>{

    const item = doc.data();

    if(item.code !== productId && count < 4){

        const image = Array.isArray(item.image)
        ? item.image[0]
        : item.image;

        relatedHTML += `

        <div class="card">

            <div class="gallery">

                <img
                src="${AKH.img(item.image)}"
                onclick="location.href='product.html?id=${item.code}'">

            </div>

            <div class="info">

                <h2>

                ${item.name}

                </h2>

                <div class="price">

                ${item.price}

                </div>

                <button

                class="cartBtn"

                onclick='addToCart(${JSON.stringify(item)})'>

                🛒 إضافة للسلة

                </button>

            </div>

        </div>

        `;

        count++;

    }

});

if(relatedBox){

    relatedBox.innerHTML = relatedHTML;

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

AKH.badges();
AKH.toast("🛒 تم إضافة المنتج للسلة");

};

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("mainProductImage")){

    document.getElementById("viewerImage").src=e.target.src;

    document.getElementById("imageViewer").style.display="flex";

}

});

document.getElementById("closeViewer").onclick=function(){

document.getElementById("imageViewer").style.display="none";

}

document.getElementById("imageViewer").onclick=function(e){

if(e.target.id=="imageViewer"){

document.getElementById("imageViewer").style.display="none";

}

}
