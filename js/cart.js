const box=document.getElementById("cartItems"), totalBox=document.getElementById("totalPrice"), goBtn=document.getElementById("goCheckout");
function render(){
  const cart=AKH.get("cart"); let total=0;
  if(!cart.length){
    box.innerHTML=`<div class="xEmpty"><div>🛒</div><h2>السلة فارغة</h2><p>لم تضيفي أي منتجات بعد</p><a href="index.html" class="btn">ابدأي التسوق</a></div>`;
    totalBox.textContent="0 جنيه"; if(goBtn) goBtn.disabled=true; return;
  }
  if(goBtn) goBtn.disabled=false;
  box.innerHTML=cart.map((p,i)=>{
    const q=Number(p.quantity)||1, line=AKH.num(p.price)*q; total+=line;
    return `<article class="xRow">
      <a href="product.html?id=${encodeURIComponent(p.code)}"><img src="${AKH.img(p.image)}" alt="${AKH.esc(p.name)}"></a>
      <div class="xRowBody">
        <h3>${AKH.esc(p.name)}</h3>
        <p class="xMeta">المقاس: ${AKH.esc(p.size||"-")} · كود ${AKH.esc(p.code)}</p>
        <div class="xRowFoot">
          <div class="xQty"><button data-i="${i}" data-d="-1" aria-label="إنقاص">−</button><span>${q}</span><button data-i="${i}" data-d="1" aria-label="زيادة">+</button></div>
          <strong>${AKH.money(line)}</strong>
        </div>
      </div>
      <button class="xDel" data-i="${i}" data-del="1" aria-label="حذف">✕</button>
    </article>`;
  }).join("");
  totalBox.textContent=AKH.money(total);
}
box.addEventListener("click",e=>{
  const b=e.target.closest("button"); if(!b) return;
  const cart=AKH.get("cart"), i=+b.dataset.i;
  if(b.dataset.del){ cart.splice(i,1); AKH.toast("تم حذف المنتج","warn"); }
  else { cart[i].quantity=(Number(cart[i].quantity)||1)+(+b.dataset.d); if(cart[i].quantity<1) cart.splice(i,1); }
  AKH.set("cart",cart); render();
});
render();
