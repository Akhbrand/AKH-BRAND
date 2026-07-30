import {initializeApp} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
getFirestore,
collection,
getDocs,
query,
where
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const firebaseConfig={

apiKey:"AIzaSyBpFVpOyPfS9C7b8Hit2NpAtcK4k-DeTPw",
authDomain:"akh-brand.firebaseapp.com",
projectId:"akh-brand"

};



const app=initializeApp(firebaseConfig);


const db=getFirestore(app);



window.searchOrders=async()=>{


let phone=document.getElementById("phoneSearch").value.trim();


let box=document.getElementById("ordersResult");



let q=query(

collection(db,"orders"),

where("customerPhone","==",phone)

);



let snap=await getDocs(q);



let html="";



snap.forEach(doc=>{


let o=doc.data();



html+=`

<div class="checkoutLeft">


<h2>
رقم الطلب:
${o.orderNumber}
</h2>


<p>
الحالة:
<strong>
${o.status}
</strong>
</p>


<p>
الإجمالي:
${o.total} EGP
</p>


<p>
عدد القطع:
${o.totalItems}
</p>


</div>


`;



});



if(html==""){

html="<h2>لا يوجد طلبات بهذا الرقم</h2>";

}



box.innerHTML=html;



};
