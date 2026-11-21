import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const db = getFirestore(initializeApp({
apiKey:"AIzaSyBpFVpOyPfS9C7b8Hit2NpAtcK4k-DeTPw",authDomain:"akh-brand.firebaseapp.com",projectId:"akh-brand",
storageBucket:"akh-brand.firebasestorage.app",messagingSenderId:"671562968837",appId:"1:671562968837:web:06557b3ab756696cf5116c"}));
const out=document.getElementById("ordersResult"), oi=document.getElementById("searchOrder"), pi=document.getElementById("searchPhone");
const q=new URLSearchParams(location.search); if(q.get("order")) oi.value=q.get("order");
const STEPS=["جاري المراجعة","تم التأكيد","جاري الشحن","تم التسليم"];
async function search(){
 const id=oi.value.trim(), phone=pi.value.trim().replace(/\s/g,"");
 if(!id||!phone){AKH.toast("اكتبي رقم الطلب ورقم الهاتف","warn");return;}
 out.innerHTML='<div class="customerOrder">⏳ جاري البحث...</div>';
 let o=null; try{const s=await getDoc(doc(db,"orders",id)); if(s.exists()) o=s.data();}catch(e){}
 if(!o||String(o.customerPhone).replace(/\s/g,"")!==phone){out.innerHTML='<div class="customerOrder"><h3>❌ مفيش طلب بالبيانات دي، راجعي رقم الطلب والهاتف</h3></div>';return;}
 const idx=STEPS.indexOf(o.status), cancelled=/ملغ/.test(o.status||"");
 out.innerHTML=`<div class="customerOrder"><h2>📦 ${AKH.esc(o.orderNumber||id)}</h2>
 <p>📅 ${new Date(o.createdAt).toLocaleDateString("ar-EG")}</p>
 ${cancelled?`<p class="status">❌ ${AKH.esc(o.status)}</p>`:`<div class="xTrack">${STEPS.map((s,i)=>`<span class="${i<=idx?"on":""}">${s}</span>`).join("")}</div>`}
 <p>💰 المجموع ${AKH.money(o.subtotal??o.total)} + شحن ${AKH.money(o.shipping??0)} = <b>${AKH.money(o.total)}</b></p>
 ${(o.products||[]).map(p=>`<div class="customerProduct"><img src="${AKH.img(p.image)}" alt=""><div><b>${AKH.esc(p.name)}</b><br>المقاس: ${AKH.esc(p.size||"-")} · الكمية: ${p.quantity||1}<br>${AKH.esc(p.price)}</div></div>`).join("")}</div>`;
}
document.getElementById("searchOrders").onclick=search;
