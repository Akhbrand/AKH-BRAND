import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection, query, where, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const db = getFirestore(initializeApp({
apiKey:"AIzaSyBpFVpOyPfS9C7b8Hit2NpAtcK4k-DeTPw",authDomain:"akh-brand.firebaseapp.com",projectId:"akh-brand",
storageBucket:"akh-brand.firebasestorage.app",messagingSenderId:"671562968837",appId:"1:671562968837:web:06557b3ab756696cf5116c"}));
const out=document.getElementById("ordersResult"), pi=document.getElementById("searchPhone");
const q=new URLSearchParams(location.search); if(q.get("phone")) pi.value=q.get("phone");
const STEPS=["جاري المراجعة","جاري التجهيز","تم الشحن","تم التسليم"];
const card=o=>{
 const idx=o.status==="جديد"?0:STEPS.indexOf(o.status), cancelled=/ملغ/.test(o.status||"");
 return `<div class="customerOrder"><h2>📦 طلب بتاريخ ${new Date(o.createdAt).toLocaleDateString("ar-EG")}</h2>
 ${cancelled?`<p class="status">❌ ${AKH.esc(o.status)}</p>`:`<div class="xTrack">${STEPS.map((s,i)=>`<span class="${i<=idx?"on":""}">${s}</span>`).join("")}</div>`}
 <p>💰 المجموع ${AKH.money(o.subtotal??o.total)} + شحن ${AKH.money(o.shipping??0)} = <b>${AKH.money(o.total)}</b></p>
 ${(o.products||[]).map(p=>`<div class="customerProduct"><img src="${AKH.img(p.image)}" alt=""><div><b>${AKH.esc(p.name)}</b><br>المقاس: ${AKH.esc(p.size||"-")} · الكمية: ${p.quantity||1}<br>${AKH.esc(p.price)}</div></div>`).join("")}</div>`;
};
async function search(){
 const phone=pi.value.replace(/\D/g,"");
 if(phone.length<10){AKH.toast("اكتبي رقم الهاتف صحيح","warn");return;}
 out.innerHTML='<div class="customerOrder">⏳ جاري البحث...</div>';
 let orders=[];
 try{
  const raw=pi.value.trim();
  const snap=await getDocs(query(collection(db,"orders"),where("customerPhone","in",[...new Set([phone,raw])]),limit(20)));
  orders=snap.docs.map(d=>d.data()).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
 }catch(e){
  console.log(e);
  out.innerHTML='<div class="customerOrder"><h3>⚠️ تعذّر جلب الطلبات</h3><p class="xMeta" dir="ltr">'+AKH.esc(e.code||e.message)+'</p><p class="xMeta">'+(e.code==="permission-denied"?"قواعد Firebase لسه ماتحدّثتش (Firestore ← Rules ← Publish).":"جرّبي مرة تانية.")+'</p></div>';
  return;
 }
 out.innerHTML=orders.length?orders.map(card).join(""):'<div class="customerOrder"><h3>❌ مفيش طلبات على الرقم ده</h3></div>';
}
document.getElementById("searchOrders").onclick=search;
pi.addEventListener("keydown",e=>{if(e.key==="Enter")search();});
if(pi.value)search();
