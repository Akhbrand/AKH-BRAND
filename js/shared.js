/* AKH shared helpers */
window.AKH = {
  SHIP: 70, WA: "201097521334", GA: "" /* ضعي رقم Google Analytics (G-XXXX) هنا */, PIXEL: "" /* ضعي رقم Meta Pixel هنا */,
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

document.addEventListener("DOMContentLoaded",()=>{
  if(!document.querySelector(".xWa")){
    const a=document.createElement("a"); a.className="xWa"; a.target="_blank"; a.rel="noopener";
    a.href="https://wa.me/"+AKH.WA+"?text="+encodeURIComponent("مرحبا، عندي استفسار"); a.setAttribute("aria-label","واتساب");
    a.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm4.52 11.99c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29z"/></svg>';
    document.body.appendChild(a);
  }
});
if(window.AKH&&AKH.PIXEL){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',AKH.PIXEL);fbq('track','PageView');}

if(AKH.GA){const g=document.createElement("script");g.async=true;g.src="https://www.googletagmanager.com/gtag/js?id="+AKH.GA;document.head.appendChild(g);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",AKH.GA);}
