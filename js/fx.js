/* AKH FX — محتوى الأقسام اللي بتحتاج بيانات منك بتتعدّل من هنا */
const REVIEWS = [
  /* مثال (فكّي التعليق وعدّلي):
  { name:"سارة", city:"القاهرة", text:"الخامة تحفة والمقاس مظبوط", stars:5 }, */
];
const COUNTDOWN = { title:"", end:"" /* مثال: title:"العرض ينتهي بعد", end:"2026-12-31T23:59:00" */ };

(function(){
  const $=s=>document.querySelector(s), ready=f=>document.readyState!=="loading"?f():document.addEventListener("DOMContentLoaded",f);
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const calm=matchMedia("(prefers-reduced-motion:reduce)").matches;

  ready(()=>{
    /* 3: heart pulse + badge bump (كل الصفحات) */
    document.addEventListener("click",e=>{const b=e.target.closest(".favoriteBtn");if(b){b.classList.remove("xPulse");void b.offsetWidth;b.classList.add("xPulse");}});
    document.querySelectorAll("#cartCount,#xCartN,#favCount,#xFavN").forEach(el=>{
      let last=el.textContent;
      new MutationObserver(()=>{if(el.textContent!==last){last=el.textContent;el.classList.remove("xBump");void el.offsetWidth;el.classList.add("xBump");}}).observe(el,{childList:true,characterData:true,subtree:true});
    });

    const grid=$("#products"), banner=$(".akhFullBanner");
    if(!grid) return;

    /* 1: reveal on scroll */
    if("IntersectionObserver" in window && !calm){
      const io=new IntersectionObserver(es=>es.forEach(en=>{
        if(en.isIntersecting){const c=en.target;c.classList.add("in");io.unobserve(c);setTimeout(()=>c.classList.remove("xReveal","in"),900);}
      }),{threshold:.08});
      const watch=()=>grid.querySelectorAll(".card:not([data-fx])").forEach(c=>{c.dataset.fx=1;c.classList.add("xReveal");io.observe(c);});
      new MutationObserver(watch).observe(grid,{childList:true}); watch();
      setTimeout(()=>grid.querySelectorAll(".xReveal").forEach(c=>c.classList.remove("xReveal","in")),4000);
    }

    /* 5: gold dust on hero */
    if(banner && !calm){
      const cv=document.createElement("canvas");cv.className="xDust";banner.appendChild(cv);
      const ctx=cv.getContext("2d"), N=innerWidth<700?26:46; let W,H,run=true,ps=[];
      const size=()=>{W=cv.width=banner.clientWidth;H=cv.height=banner.clientHeight;};
      size();addEventListener("resize",size);
      for(let i=0;i<N;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.6,v:Math.random()*.35+.12,d:Math.random()*Math.PI*2,a:Math.random()*.6+.25});
      (function loop(){
        if(run){ctx.clearRect(0,0,W,H);ps.forEach(p=>{p.y+=p.v;p.d+=.01;p.x+=Math.sin(p.d)*.35;if(p.y>H+4){p.y=-4;p.x=Math.random()*W;}
          ctx.beginPath();ctx.fillStyle="rgba(241,220,154,"+p.a+")";ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();});}
        requestAnimationFrame(loop);
      })();
      if("IntersectionObserver" in window)new IntersectionObserver(e=>run=e[0].isIntersecting).observe(banner);
    }

    /* 9: marquee بعد البانر */
    if(banner){
      const t=["NEW COLLECTION","OVERSIZED STREETWEAR","AKH BRAND","FEMININE LUXURY"];
      const row=Array(4).fill(t.map(x=>"<span>"+x+"</span><span>♛</span>").join("")).join("");
      const m=document.createElement("div");m.className="xMarquee";m.innerHTML="<div>"+row+"</div>";banner.after(m);

      /* 12: countdown */
      const end=COUNTDOWN.end&&new Date(COUNTDOWN.end).getTime();
      if(end&&end>Date.now()){
        const c=document.createElement("div");c.className="xCount";
        c.innerHTML="<h3>"+esc(COUNTDOWN.title||"العرض ينتهي بعد")+'</h3><div class="t"><div><b id="cd">0</b><small>يوم</small></div><div><b id="ch">0</b><small>ساعة</small></div><div><b id="cm">0</b><small>دقيقة</small></div><div><b id="cs">0</b><small>ثانية</small></div></div>';
        m.after(c);
        const tick=()=>{let s=Math.max(0,Math.floor((end-Date.now())/1000));
          const q=i=>c.querySelector("#"+i);q("cd").textContent=Math.floor(s/86400);q("ch").textContent=Math.floor(s%86400/3600);q("cm").textContent=Math.floor(s%3600/60);q("cs").textContent=s%60;if(!s)c.remove();};
        tick();setInterval(tick,1000);
      }
    }

    /* 10: lookbook من صور المنتجات */
    const foot=$(".akhFooter");
    const build=()=>{
      if($(".xLookbook")||!foot) return;
      const cards=[...grid.querySelectorAll(".card")].filter(c=>c.querySelector(".slider img")&&!c.querySelector(".soldOutBadge")).slice(0,8);
      if(cards.length<3) return;
      const sec=document.createElement("section");sec.className="xLookbook";
      sec.innerHTML="<h2>STYLE OF THE DAY</h2><div class=\"xLookRow\">"+cards.map((c,i)=>{
        const im=c.querySelector(".slider img"), nm=(c.querySelector(".info h2")||{}).innerText||"";
        return '<div class="xLook" data-i="'+i+'"><img src="'+esc(im.src)+'" alt="" loading="lazy"><span>'+esc(nm)+"</span></div>";}).join("")+"</div>";
      foot.before(sec);
      sec.addEventListener("click",e=>{const l=e.target.closest(".xLook");if(l)cards[+l.dataset.i].click();});

      /* 11: reviews من القايمة اللي فوق */
      if(REVIEWS.length){
        const r=document.createElement("section");r.className="xReviews";
        r.innerHTML="<h2>آراء العميلات</h2><div class=\"xRevRow\">"+REVIEWS.map(v=>'<div class="xRev"><div class="st">'+"★".repeat(Math.min(5,v.stars||5))+"</div><p>"+esc(v.text)+"</p><b>"+esc(v.name)+"</b> <small>"+esc(v.city||"")+"</small></div>").join("")+"</div>";
        sec.after(r);
      }
    };
    new MutationObserver(()=>{if(grid.querySelector(".card")){build();}}).observe(grid,{childList:true});build();
  });
})();
