(function(){
  const grid=document.getElementById("products"), box=document.querySelector(".searchBox");
  if(!grid||!box) return;
  const bar=document.createElement("div"); bar.className="xTools";
  bar.innerHTML='<select id="xSort" aria-label="الترتيب"><option value="0">الترتيب: الافتراضي</option><option value="asc">السعر: الأقل أولًا</option><option value="desc">السعر: الأعلى أولًا</option></select><button type="button" id="xAvail">المتاح فقط</button>';
  box.after(bar);
  let only=false, busy=false;
  const cards=()=>[...grid.querySelectorAll(".card")];
  function apply(){
    busy=true;
    const list=cards();
    list.forEach((c,i)=>{ if(c.dataset.o===undefined) c.dataset.o=i; });
    const dir=document.getElementById("xSort").value;
    const price=c=>AKH.num((c.querySelector(".price")||{}).innerText);
    const sorted=[...list].sort((a,b)=>dir==="asc"?price(a)-price(b):dir==="desc"?price(b)-price(a):a.dataset.o-b.dataset.o);
    sorted.forEach(c=>{ grid.appendChild(c); c.classList.toggle("xHide",only&&!!c.querySelector(".soldOutBadge")); });
    setTimeout(()=>busy=false,0);
  }
  document.getElementById("xSort").onchange=apply;
  document.getElementById("xAvail").onclick=function(){only=!only;this.classList.toggle("on",only);apply();};
  new MutationObserver(()=>{ if(!busy && cards().some(c=>c.dataset.o===undefined)) apply(); }).observe(grid,{childList:true});
})();
