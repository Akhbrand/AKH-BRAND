/* AKH shared helpers */
window.AKH = {
  get(k){ try{ const v=JSON.parse(localStorage.getItem(k)); return Array.isArray(v)?v:[]; }catch(e){ return []; } },
  set(k,v){ localStorage.setItem(k,JSON.stringify(v)); AKH.badges(); },
  img(i){ i=Array.isArray(i)?i[0]:i; return !i?"images/hero.jpg.jpg":(/^(https?:|\.\/|\/)/.test(i)?i:"images/"+i); },
  num(p){ return Number(String(p).replace(/[^\d.]/g,""))||0; },
  esc(s){ return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); },
  money(n){ return n.toLocaleString("en-US")+" جنيه"; },
  toast(m,t){
    let el=document.getElementById("xToast");
    if(!el){ el=document.createElement("div"); el.id="xToast"; document.body.appendChild(el); }
    el.className="xToast "+(t||"ok")+" show"; el.textContent=m;
    clearTimeout(AKH._t); AKH._t=setTimeout(()=>el.classList.remove("show"),2200);
  },
  badges(){
    const c=AKH.get("cart").reduce((s,i)=>s+(Number(i.quantity)||1),0), f=AKH.get("favorites").length;
    document.querySelectorAll("#xCartN,#cartCount").forEach(e=>e.textContent=c);
    document.querySelectorAll("#xFavN,#favCount").forEach(e=>e.textContent=f);
  }
};
document.addEventListener("DOMContentLoaded",()=>{
  const bar=document.getElementById("xBar");
  if(bar){
    bar.innerHTML=`<a class="xLogo" href="index.html"><span>♛</span> AKH BRAND</a>
    <b class="xTitle">${bar.dataset.title||""}</b>
    <nav class="xActs"><a href="favorites.html" aria-label="المفضلة">♥<i id="xFavN">0</i></a>
    <a href="cart.html" aria-label="السلة">🛒<i id="xCartN">0</i></a></nav>`;
  }
  AKH.badges();
});
