const cart = JSON.parse(localStorage.getItem("cart")) || [];

const box = document.getElementById("cartItems");

let total = 0;

if (cart.length === 0) {

    box.innerHTML = `
        <div class="card">
            <div class="info">
                <h2>🛒 السلة فارغة</h2>
                <p>أضف منتجات أولاً من الصفحة الرئيسية.</p>
            </div>
        </div>
    `;

} else {

   cart.forEach((product, index) => {
const qty = product.quantity || 1;

const price = parseFloat(
    String(product.price).replace(/[^\d.]/g, "")
) || 0;

total += price * qty;
        const image = Array.isArray(product.image)
            ? product.image[0]
            : product.image;

        box.innerHTML += `
            <div class="card">

                <div class="cartImageBox">
                    <img class="cartImage" src="${image}" alt="${product.name}">
                </div>

                <div class="info">

                    <h2>${product.name}</h2>

                    <div class="price">
                        ${product.price}
                    </div>

                    <p>الخامة: ${product.material}</p>
               <p>المقاس: ${product.size}</p>

               <p>الكمية: <span>${product.quantity || 1}</span></p>
<button class="deleteBtn" onclick="removeFromCart('${product.code}')">
🗑️ حذف المنتج
</button>
<div class="qtyBox">

<button class="qtyBtn" onclick="changeQty(${index},-1)">➖</button>

<span class="qtyNumber">${product.quantity || 1}</span>

<button class="qtyBtn" onclick="changeQty(${index},1)">➕</button>

</div>

<button class="deleteBtn" onclick="removeFromCart(${index})">
🗑️ حذف المنتج
</button>

</div>

</div>
`;

    });

}

window.removeFromCart = function(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();

}
window.changeQty = function(index, change){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity = (cart[index].quantity || 1) + change;

    if(cart[index].quantity <= 0){
        cart.splice(index,1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();

}

const totalBox = document.getElementById("totalPrice");

if(totalBox){
    totalBox.innerHTML = total + " EGP";
}
