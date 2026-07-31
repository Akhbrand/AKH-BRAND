const favorites =
JSON.parse(localStorage.getItem("favorites")) || [];

const box =
document.getElementById("favoritesProducts");

if(favorites.length===0){

box.innerHTML=`

<div class="card">

<div class="info" style="text-align:center;padding:60px;">

<h2>

❤️ لا توجد منتجات محفوظة

</h2>

<p>

قم بإضافة منتجات إلى المفضلة أولاً.

</p>

<a href="index.html" class="btn">

العودة للتسوق

</a>

</div>

</div>

`;

}else{

favorites.forEach(product=>{

const image =
Array.isArray(product.image)
?
product.image[0]
:
product.image;

box.innerHTML += `

<div class="card">

<div class="gallery">

<img
src="${image}"
onclick="location.href='product.html?id=${product.code}'">

</div>

<div class="info">

<h2>

${product.name}

</h2>

<div class="price">

${product.price}

</div>

<a
class="btn"
href="product.html?id=${product.code}">

عرض المنتج

</a>

</div>

</div>

`;

});

}
