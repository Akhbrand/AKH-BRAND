const box=document.getElementById("favoritesProducts");
function render(){
  const favs=AKH.get("favorites");
  if(!favs.length){
    box.innerHTML=`<div class="xEmpty"><div>🤍</div><h2>لا توجد منتجات محفوظة</h2><p>اضغطي على القلب في أي منتج لحفظه هنا</p><a href="index.html" class="btn">العودة للتسوق</a></div>`;
    return;
  }
  box.innerHTML=favs.map((p,i)=>`<article class="xFav">
    <a class="xFavImg" href="product.html?id=${encodeURIComponent(p.code)}"><img src="${AKH.img(p.image)}" alt="${AKH.esc(p.name)}" loading="lazy">
    ${p.available===false?'<span class="xSold">SOLD OUT</span>':''}</a>
    <button class="xFavRm" data-i="${i}" aria-label="إزالة من المفضلة">❤️</button>
    <div class="xFavInfo"><h3>${AKH.esc(p.name)}</h3><div class="price">${AKH.esc(p.price)}</div>
    ${p.available===false?'<button class="cartBtn" disabled>نفد المخزون</button>':`<button class="cartBtn" data-add="${i}">🛒 أضف للسلة</button>`}</div>
  </article>`).join("");
}
box.addEventListener("click",e=>{
  const b=e.target.closest("button"); if(!b) return;
  const favs=AKH.get("favorites");
  if(b.dataset.i!==undefined){ favs.splice(+b.dataset.i,1); AKH.set("favorites",favs); AKH.toast("تمت الإزالة من المفضلة","warn"); render(); }
  if(b.dataset.add!==undefined){
    const p=favs[+b.dataset.add], cart=AKH.get("cart"), ex=cart.find(c=>String(c.code)===String(p.code));
    if(ex) ex.quantity=(Number(ex.quantity)||1)+1; else cart.push({...p,quantity:1});
    AKH.set("cart",cart); AKH.toast("🛒 تمت الإضافة للسلة");
  }
});
render();
