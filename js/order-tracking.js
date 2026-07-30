import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,

collection,

getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




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





const button =
document.getElementById("searchOrders");



button.onclick = async function(){



const phone =
document.getElementById("searchPhone")
.value.trim();



const result =
document.getElementById("ordersResult");



if(!phone){


alert("اكتب رقم الهاتف");


return;

}




result.innerHTML=
"⏳ جاري البحث...";





const snapshot =
await getDocs(
collection(db,"orders")
);





let found=false;


let html="";





snapshot.forEach(doc=>{


const order=doc.data();



if(order.customerPhone == phone){



found=true;



html += `


<div class="customerOrder">



<h2>
📦 طلب رقم
${doc.id.slice(0,6)}
</h2>




<p>
📅 التاريخ:
${new Date(order.createdAt)
.toLocaleDateString("ar-EG")}
</p>





<p>

🚚 الحالة:

<strong class="status">

${order.status}

</strong>

</p>





<p>
💰 الإجمالي:
${order.total} EGP
</p>





<h3>
المنتجات:
</h3>



`;




order.products.forEach(product=>{


html += `


<div class="customerProduct">


<img src="${
Array.isArray(product.image)
?
product.image[0]
:
product.image
}">


<div>


<b>
${product.name}
</b>


<br>


الكمية:
${product.quantity || 1}



<br>


السعر:
${product.price}



</div>



</div>



`;


});



html += `

</div>

`;



}



});







if(!found){


result.innerHTML=`

<div class="customerOrder">

<h3>

❌ لا يوجد طلبات بهذا الرقم

</h3>

</div>

`;

return;


}




result.innerHTML=html;



}
