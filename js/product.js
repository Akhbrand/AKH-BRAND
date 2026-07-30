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


const app=initializeApp(firebaseConfig);

const db=getFirestore(app);



const id=new URLSearchParams(location.search).get("id");



const box=document.getElementById("productPage");



const snap=await getDocs(collection(db,"products"));



snap.forEach(doc=>{


let p=doc.data();



if(p.code==id){


let img=p.image[0] || p.image;



box.innerHTML=`

<div class="singleProduct">


<img src="./images/${img}">


<h1>
${p.name}
</h1>


<h2>
${p.price}
</h2>


<p>
الخامة: ${p.material}
</p>


<p>
المقاس: ${p.size}
</p>


<p>
${p.description || ""}
</p>


<button class="cartBtn">

🛒 أضف للسلة

</button>


<a class="btn"
href="https://wa.me/201097521334">

اطلب واتساب

</a>


</div>

`;


}


});
